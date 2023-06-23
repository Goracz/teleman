package com.goracz.statsservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.statsservice.component.RedisCacheProvider;
import com.goracz.statsservice.constant.CacheKeys;
import com.goracz.statsservice.constant.KafkaTopic;
import com.goracz.statsservice.entity.ChannelHistory;
import com.goracz.statsservice.exception.KafkaConsumeFailException;
import com.goracz.statsservice.model.WebOSApplication;
import com.goracz.statsservice.model.request.ChannelHistoryRequest;
import com.goracz.statsservice.model.response.*;
import com.goracz.statsservice.repository.ReactiveSortingChannelHistoryRepository;
import com.goracz.statsservice.service.ChannelHistoryService;
import com.goracz.statsservice.service.EventService;
import com.goracz.statsservice.service.WebChannelMetadataService;
import com.goracz.statsservice.service.WebForegroundApplicationService;

import lombok.extern.slf4j.Slf4j;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.logging.log4j.util.Strings;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

import java.time.ZoneId;

@Service
@Slf4j
public class ChannelHistoryServiceImpl implements ChannelHistoryService {
    private static final int CACHE_WRITE_TRIES = 3;
    private static final int RETRY_TRIES = 3;

    private final EventService<EventMessage<ChannelHistory>> channelHistoryEventService;
    private final EventService<EventMessage<ForegroundAppChangeResponse>> foregroundAppEventService;
    private final ReactiveSortingChannelHistoryRepository channelHistoryRepository;
    private final WebChannelMetadataService webChannelMetadataService;
    private final WebForegroundApplicationService webForegroundApplicationService;
    private final RedisCacheProvider cacheProvider;
    private final ObjectMapper objectMapper;

    public ChannelHistoryServiceImpl(final EventService<EventMessage<ChannelHistory>> channelHistoryEventService,
            final EventService<EventMessage<ForegroundAppChangeResponse>> foregroundAppEventService,
            final ReactiveSortingChannelHistoryRepository channelHistoryRepository,
            final WebChannelMetadataService webChannelMetadataService,
            final WebForegroundApplicationService webForegroundApplicationService,
            final RedisCacheProvider cacheProvider,
            final ObjectMapper objectMapper) {
        this.channelHistoryEventService = channelHistoryEventService;
        this.foregroundAppEventService = foregroundAppEventService;
        this.channelHistoryRepository = channelHistoryRepository;
        this.webChannelMetadataService = webChannelMetadataService;
        this.webForegroundApplicationService = webForegroundApplicationService;
        this.cacheProvider = cacheProvider;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Flux<ChannelHistory> getByTimeRange(final ChannelHistoryRequest channelHistoryRequest) {
        return this.channelHistoryRepository
                .findAllByStartBetween(
                        channelHistoryRequest
                                .getStart()
                                .atStartOfDay(ZoneId.systemDefault()),
                        channelHistoryRequest
                                .getEnd()
                                .atStartOfDay(ZoneId.systemDefault()))
                .publishOn(Schedulers.newBoundedElastic(
                        100, Integer.MAX_VALUE, "channel-history-service"))
                .flatMap(this::populateChannelHistoryWithMetadata);
    }

    private Mono<ChannelHistory> populateChannelHistoryWithMetadata(final ChannelHistory channelHistory) {
        return channelHistory.getChannelName() != null
                ? this.webChannelMetadataService
                        .getChannelMetadataByChannelName(channelHistory.getChannelName())
                        .doOnNext(channelMetadata ->
                                log.debug("[populateChannelHistoryWithMetadata] @channelMetadata: {}", channelMetadata))
                        .map(metadata -> ChannelHistory.withMetadata(channelHistory, metadata))
                        .doOnNext(populatedChannelHistory ->
                                log.debug(
                                        "[populateChannelHistoryWithMetadata] @populatedChannelHistory: {}",
                                        populatedChannelHistory
                                )
                        )
                        .publishOn(Schedulers.parallel())
                : this.populateApplicationPackageIfChannelIsUnknown(channelHistory);
    }

    @Override
    @Transactional
    public Mono<ChannelHistory> add(final ChannelHistory channelHistory) {
        return this.channelHistoryRepository
                .save(channelHistory)
                .retry(RETRY_TRIES)
                .log()
                .publishOn(Schedulers.boundedElastic());
    }

    @Override
    @Transactional
    public Mono<Void> delete(final String channelHistoryId) {
        return this.channelHistoryRepository
                .deleteById(channelHistoryId)
                .retry(RETRY_TRIES)
                .log()
                .publishOn(Schedulers.boundedElastic());
    }

    /**
     * <p>
     * Listens for channel changes.
     * </p>
     * <p>
     * If a channel change event is received, it checks whether that is the first
     * channel change
     * since the TV has been turned on.
     * </p>
     * <p>
     * If this is the case, a new channel history object is being created with the
     * current date time
     * as the watch start time.
     * </p>
     * <p>
     * If this is not the case, the previous channel history object is being updated
     * with the current date time
     * as the watch end time, is being persisted to the database and all the
     * listeners are being notified
     * that a new statistics entry has been created.
     * </p>
     *
     * @param message Message that is being received from the Kafka topic, ideally a
     *                CurrentTvChannelResponse object.
     * @throws KafkaConsumeFailException If the message cannot be parsed to a
     *                                   CurrentTvChannelResponse object.
     */
    // TODO: Move the notification and cache update to control-service (together with meta querying, etc.),
    //  and use this methood oonly to update stats
    @KafkaListener(topics = KafkaTopic.CHANNEL_CHANGES)
    public void onChannelChange(final ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            this.handleChannelChange(message).subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    private Mono<Void> handleChannelChange(final ConsumerRecord<String, String> message) {
        return this.readCurrentChannelFromMqMessage(message)
                .publishOn(Schedulers.boundedElastic())
                .map(response -> this.readLatestChannelHistoryFromCache()
                        .switchIfEmpty(this.readLatestChannelHistoryFromDatabase())
                        .switchIfEmpty(ChannelHistory.empty())
                        .publishOn(Schedulers.boundedElastic())
                        .doOnNext(latestChannelHistoryEntry -> {
                            log.debug(
                                    "handleChannelChange / latestChannelHistoryEntry: {}; " +
                                            "currentTvChannelResponse: {}",
                                    latestChannelHistoryEntry.toString(), response.toString()
                            );
                        })
                        .doOnNext(latestChannelHistoryEntry -> {
                            if (Strings.isNotEmpty(latestChannelHistoryEntry.getChannelName()) &&
                                    latestChannelHistoryEntry.getChannelName().equals(response.getChannelName())) {
                                // No-op as the channel has not changed, even though we got such an event.
                                log.debug("handleChannelChange / Channel has not changed, " +
                                        "even though we got such an event.");
                                return;
                            }
                            if (latestChannelHistoryEntry.isNew()) {
                                // A channel is already in the cache, the current channel's end
                                // time has to be set to now.
                                // After that, the channel that has just been changed to also has to be
                                // processed.
                                this.markLatestChannelHistoryAsEnded(latestChannelHistoryEntry)
                                        .flatMap(ignored -> this.addNewChannelHistory(response))
                                        .subscribe();
                                log.debug("handleChannelChange / Channel has changed, so the latest " +
                                        "channel history entry has been marked as ended " +
                                        "and a new one was added with the current channel.");
                            } else {
                                // A channel is not in the cache yet, so the current channel's start
                                // time has to be set to now.
                                this.cacheProvider.getPowerStateResponseCache()
                                        .get(CacheKeys.POWER_STATE_CACHE_KEY)
                                        .publishOn(Schedulers.boundedElastic())
                                        .doOnNext(powerStateResponse -> {
                                            if (!powerStateResponse.getState().equals(PowerState.ACTIVE))
                                                return;
                                            this.addNewChannelHistory(response).subscribe();
                                        })
                                        .subscribe();
                                log.debug("handleChannelChange / Channel has changed, " +
                                        "so a new channel history entry was added with the current channel.");
                            }
                        })
                        .subscribe())
                .then();
    }

    private Mono<ChannelHistory> readLatestChannelHistoryFromCache() {
        return this.cacheProvider.getChannelHistoryCache().get(CacheKeys.TV_CHANNEL_HISTORY_KEY);
    }

    private Mono<ChannelHistory> readLatestChannelHistoryFromDatabase() {
        return this.channelHistoryRepository.findFirstByOrderByStartDesc();
    }

    private Mono<CurrentTvChannelResponse> readCurrentChannelFromMqMessage(
            final ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> this.objectMapper.readValue(message.value(), CurrentTvChannelResponse.class));
    }

    private Mono<ChannelHistory> markLatestChannelHistoryAsEnded(final ChannelHistory channelHistory) {
        return this.populateChannelHistoryWithMetadata(channelHistory)
                .onErrorReturn(channelHistory)
                .flatMap(this::writeChannelHistoryWithCurrentDateAsEndToDatabase)
                .flatMap(this::writeChannelHistoryToCache)
                .doOnNext(this::notifyListenersAboutChannelHistoryChange);
    }

    private Mono<Void> addNewChannelHistory(final CurrentTvChannelResponse currentChannel) {
        return this.webChannelMetadataService
                .getChannelMetadataByChannelName(currentChannel.getChannelName())
                .doOnNext(channelMetadata ->
                        log.debug("[addNewChannelHistory] @channelMetadata: {}", channelMetadata.toString()))
                .onErrorReturn(ChannelMetadataResponse.empty())
                .map(channelMetadata -> Mono
                        .fromCallable(() -> ChannelHistory.fromCurrentChannelAndMetadata(currentChannel,
                                channelMetadata))
                        .flatMap(this::populateApplicationPackageIfChannelIsUnknown)
                        .flatMap(this.channelHistoryRepository::save)
                        .doOnNext(channelHistory ->
                                log.debug("[addNewChannelHistory] @channelHistory: {}", channelHistory.toString()))
                        .flatMap(this::writeChannelHistoryToCache)
                        .flatMap(this::notifyListenersAboutChannelHistoryChange))
                .then()
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<ChannelHistory> populateApplicationPackageIfChannelIsUnknown(final ChannelHistory channelHistory) {
        return Mono.fromCallable(() -> {
            if (channelHistory.getChannelName() == null) {
                this.readForegroundApplicationFromCache()
                        .switchIfEmpty(this.webForegroundApplicationService.getForegroundApplication())
                        .map(channelHistory::setForegroundAppTo)
                        .subscribe();
            }
            return channelHistory;
        }).publishOn(Schedulers.boundedElastic());
    }

    private Mono<ForegroundAppChangeResponse> readForegroundApplicationFromCache() {
        return this.cacheProvider
                .getForegroundAppChangeResponseCache()
                .get(CacheKeys.FOREGROUND_APP_CACHE_KEY)
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<ChannelHistory> writeChannelHistoryWithCurrentDateAsEndToDatabase(
            final ChannelHistory channelHistory) {
        return Mono.fromCallable(() -> {
            if (channelHistory.isNew()) {
                channelHistory.endViewNow();
                this.channelHistoryRepository
                        .save(channelHistory)
                        .subscribe();
            }
            return channelHistory;
        }).publishOn(Schedulers.boundedElastic());
    }

    @KafkaListener(topics = KafkaTopic.FOREGROUND_APP_CHANGES)
    public void onForegroundAppChange(final ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            this.handleForegroundAppChange(message).subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    /**
     * Writes the current foreground application to the cache.
     * Additionally, if the foreground application is a third party application,
     * it ends the current channel history and starts a new one with the current application.
     * @param message Foreground app change message.
     * @return The current foreground application.
     */
    private Mono<ForegroundAppChangeResponse> handleForegroundAppChange(final ConsumerRecord<String, String> message) {
        return this.readForegroundAppChangeMessageFromMq(message)
                .publishOn(Schedulers.immediate())
                .doOnNext(response -> {
                    log.debug("[handleForegroundAppChange] Before writing to cache: {}", response);
                    this.writeForegroundApplicationToCache(response).subscribe();
                })
                .flatMap(event -> {
                    if (isApplicationBlank(event) || isTvRunningChannelPlayback(event))
                        return Mono.just(event);
                    return this.markLatestChannelHistoryAsEnded()
                            .flatMap(latestChannelHistory -> this
                                    .createNewChannelHistoryWithCurrentlyRunningApplication(event))
                            .thenReturn(event);
                })
                .doOnNext(response -> {
                    log.debug("[handleForegroundAppChange] After writing to cache: {}", response);
                    this.notifyListenersAboutForegroundAppChange(response).subscribe();
                });
    }

    private Mono<Void> writeForegroundApplicationToCache(final ForegroundAppChangeResponse response) {
        return this.cacheProvider.getForegroundAppChangeResponseCache()
                .set(CacheKeys.FOREGROUND_APP_CACHE_KEY, response)
                .map(ignored -> {
                    log.debug("Writing to cache: {}", response);
                    return response;
                })
                .retry(CACHE_WRITE_TRIES)
                .log()
                .then()
                .publishOn(Schedulers.boundedElastic());
    }

    private boolean isApplicationBlank(final ForegroundAppChangeResponse response) {
        return response.getAppId().getAppPackageName().equals(WebOSApplication.BLANK.getAppPackageName());
    }

    private Mono<ForegroundAppChangeResponse> readForegroundAppChangeMessageFromMq(
            final ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> this.objectMapper
                .readValue(message.value(), ForegroundAppChangeResponse.class))
                .publishOn(Schedulers.parallel());
    }

    private boolean isTvRunningChannelPlayback(final ForegroundAppChangeResponse response) {
        return Strings.isNotEmpty(response.getAppId().getAppPackageName()) &&
                !response.getAppId().getAppPackageName().equals(WebOSApplication.TV.getAppPackageName());
    }

    private Mono<ChannelHistory> markLatestChannelHistoryAsEnded() {
        return this.cacheProvider
                .getChannelHistoryCache()
                .get(CacheKeys.TV_CHANNEL_HISTORY_KEY)
                .switchIfEmpty(this.readLatestChannelHistoryFromDatabase())
                .map(ChannelHistory::endViewNow)
                .flatMap(this.channelHistoryRepository::save)
                .flatMap(this::writeChannelHistoryToCache)
                .doOnNext(this::notifyListenersAboutChannelHistoryChange);
    }

    private Mono<ChannelHistory> createNewChannelHistoryWithCurrentlyRunningApplication(
            final ForegroundAppChangeResponse foregroundAppChangeResponse) {
        return ChannelHistory
                .fromForegroundApplication(foregroundAppChangeResponse)
                .flatMap(this.channelHistoryRepository::save)
                .flatMap(this::writeChannelHistoryToCache)
                .doOnNext(this::notifyListenersAboutChannelHistoryChange);
    }

    /**
     * Sets the latest channel history entry in the cache and notifies the listeners
     * about it
     * 
     * @param channelHistory Channel history object to place into the cache and
     *                       notify the listeners about
     * @return Channel history object that has been passed as an argument
     */
    private Mono<ChannelHistory> writeChannelHistoryToCache(final ChannelHistory channelHistory) {
        return this.cacheProvider
                .getChannelHistoryCache()
                .set(CacheKeys.TV_CHANNEL_HISTORY_KEY, channelHistory)
                .map(result -> channelHistory)
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<Sinks.EmitResult> notifyListenersAboutChannelHistoryChange(final ChannelHistory channelHistory) {
        return Mono.fromCallable(() -> EventMessage.fromChannelHistoryChange(channelHistory))
                .flatMap(this.channelHistoryEventService::emit)
                .publishOn(Schedulers.immediate());
    }

    private Mono<Sinks.EmitResult> notifyListenersAboutForegroundAppChange(
            final ForegroundAppChangeResponse foregroundApp) {
        return Mono.fromCallable(() -> EventMessage.fromForegroundAppChange(foregroundApp))
                .flatMap(this.foregroundAppEventService::emit)
                .publishOn(Schedulers.immediate());
    }
}
