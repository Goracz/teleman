package com.goracz.statsservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.statsservice.component.RedisCacheProvider;
import com.goracz.statsservice.entity.ChannelHistory;
import com.goracz.statsservice.exception.KafkaConsumeFailException;
import com.goracz.statsservice.model.WebOSApplication;
import com.goracz.statsservice.model.request.ChannelHistoryRequest;
import com.goracz.statsservice.model.response.*;
import com.goracz.statsservice.repository.ReactiveSortingChannelHistoryRepository;
import com.goracz.statsservice.service.ChannelHistoryService;
import com.goracz.statsservice.service.EventService;
import com.goracz.statsservice.service.WebChannelMetadataService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

import java.time.ZoneId;

@Service
public class ChannelHistoryServiceImpl implements ChannelHistoryService {
    private static final int CACHE_WRITE_TRIES = 3;

    private static final String TV_CHANNEL_HISTORY_KEY = "tv:channel:history";
    private static final String POWER_STATE_CACHE_KEY = "system:power:state";
    private static final String FOREGROUND_APP_CACHE_KEY = "system:foreground-app";

    private static final int RETRY_TRIES = 3;

    private final EventService<EventMessage<ChannelHistory>> channelHistoryEventService;
    private final EventService<EventMessage<PowerStateResponse>> powerStateEventService;
    private final ReactiveSortingChannelHistoryRepository channelHistoryRepository;
    private final WebChannelMetadataService webChannelMetadataService;
    private final RedisCacheProvider cacheProvider;
    private final ObjectMapper objectMapper;

    public ChannelHistoryServiceImpl(EventService<EventMessage<ChannelHistory>> channelHistoryEventService,
                                     EventService<EventMessage<PowerStateResponse>> powerStateEventService,
                                     ReactiveSortingChannelHistoryRepository channelHistoryRepository,
                                     WebChannelMetadataService webChannelMetadataService,
                                     RedisCacheProvider cacheProvider,
                                     ObjectMapper objectMapper) {
        this.channelHistoryEventService = channelHistoryEventService;
        this.powerStateEventService = powerStateEventService;
        this.channelHistoryRepository = channelHistoryRepository;
        this.webChannelMetadataService = webChannelMetadataService;
        this.cacheProvider = cacheProvider;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Flux<ChannelHistory> getByTimeRange(ChannelHistoryRequest channelHistoryRequest) {
        return this.channelHistoryRepository
                .findAllByStartBetween(
                        channelHistoryRequest
                                .getStart()
                                .atStartOfDay(ZoneId.systemDefault()),
                        channelHistoryRequest
                                .getEnd()
                                .atStartOfDay(ZoneId.systemDefault()))
                .flatMap(this::populateChannelHistoryWithMetadata);
    }

    private Mono<ChannelHistory> populateChannelHistoryWithMetadata(ChannelHistory channelHistory) {
        return channelHistory.getChannelName() != null
                ? this.webChannelMetadataService
                .getChannelMetadataByChannelName(channelHistory.getChannelName())
                .map(metadata -> ChannelHistory.withMetadata(channelHistory, metadata))
                : Mono.just(channelHistory); // TODO: instead -> getChannelMetadataByApplicationPackage()
    }

    @Override
    @Transactional
    public Mono<ChannelHistory> add(ChannelHistory channelHistory) {
        return this.channelHistoryRepository
                .save(channelHistory)
                .retry(RETRY_TRIES)
                .log();
    }

    @Override
    @Transactional
    public Mono<Void> delete(String channelHistoryId) {
        return this.channelHistoryRepository
                .deleteById(channelHistoryId)
                .retry(RETRY_TRIES)
                .log();
    }

    /**
     * <p>
     * Listens for channel changes.
     * </p>
     * <p>
     * If a channel change event is received, it checks whether that is the first channel change
     * since the TV has been turned on.
     * </p>
     * <p>
     * If this is the case, a new channel history object is being created with the current date time
     * as the watch start time.
     * </p>
     * <p>
     * If this is not the case, the previous channel history object is being updated with the current date time
     * as the watch end time, is being persisted to the database and all the listeners are being notified
     * that a new statistics entry has been created.
     * </p>
     * @param message Message that is being received from the Kafka topic, ideally a CurrentTvChannelResponse object.
     * @throws KafkaConsumeFailException If the message cannot be parsed to a CurrentTvChannelResponse object.
     */
    @KafkaListener(topics = "channel-change")
    @Transactional
    public void onChannelChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
           this.handleChannelChange(message).subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    private Mono<Void> handleChannelChange(ConsumerRecord<String, String> message) {
        return this.readCurrentChannelFromMqMessage(message)
                .map(response -> this.readLatestChannelHistoryFromCache()
                        .switchIfEmpty(this.readLatestChannelHistoryFromDatabase())
                        .switchIfEmpty(ChannelHistory.empty())
                        .doOnNext(latestChannelHistoryEntry -> {
                            if (latestChannelHistoryEntry.getChannelName().equals(response.getChannelName())) {
                                // No-op as the channel has not changed, even though we got such an event.
                                return;
                            }
                            if (latestChannelHistoryEntry.isNew()) {
                                // A channel is already in the cache, the current channel's end
                                // time has to be set to now.
                                // After that, the channel that has just been changed to also has to be processed.
                                this.updateLatestChannelHistory(latestChannelHistoryEntry)
                                        .flatMap(ignored -> this.addNewChannelHistory(response))
                                        .subscribeOn(Schedulers.parallel())
                                        .subscribe();
                            } else {
                                // A channel is not in the cache yet, so the current channel's start
                                // time has to be set to now.
                                this.addNewChannelHistory(response)
                                        .subscribeOn(Schedulers.parallel())
                                        .subscribe();
                            }
                        })
                        .subscribeOn(Schedulers.parallel())
                        .subscribe())
                .then();
    }

    private Mono<ChannelHistory> readLatestChannelHistoryFromCache() {
        return this.cacheProvider.getChannelHistoryCache().get(TV_CHANNEL_HISTORY_KEY);
    }

    private Mono<ChannelHistory> readLatestChannelHistoryFromDatabase() {
        return this.channelHistoryRepository.findFirstByOrderByStartDesc();
    }

    private Mono<CurrentTvChannelResponse> readCurrentChannelFromMqMessage(ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> this.objectMapper.readValue(message.value(), CurrentTvChannelResponse.class));
    }

    private Mono<ChannelHistory> updateLatestChannelHistory(ChannelHistory channelHistory) {
        return this.populateChannelHistoryWithMetadata(channelHistory)
                    .flatMap(this::writeChannelHistoryWithCurrentDateAsEndToDatabase)
                    .flatMap(this::writeChannelHistoryToCache)
                    .flatMap(this::notifyListeners);
    }

    private Mono<Void> addNewChannelHistory(CurrentTvChannelResponse currentChannel) {
        return this.webChannelMetadataService
                .getChannelMetadataByChannelName(currentChannel.getChannelName())
                .map(channelMetadata ->
                        Mono.fromCallable(() -> ChannelHistory.fromCurrentChannelAndMetadata(currentChannel, channelMetadata))
                                .flatMap(this::populateApplicationPackageIfChannelIsUnknown)
                                .flatMap(this.channelHistoryRepository::save)
                        .flatMap(this::writeChannelHistoryToCache)
                        .flatMap(this::notifyListeners))
                .then();
    }

    private Mono<ChannelHistory> populateApplicationPackageIfChannelIsUnknown(ChannelHistory channelHistory) {
        return Mono.fromCallable(() -> {
            if (channelHistory.getChannelName() == null) {
                this.readForegroundApplicationFromCache()
                        .map(channelHistory::setForegroundAppTo)
                        .subscribeOn(Schedulers.parallel())
                        .subscribe();
            }
            return channelHistory;
        });
    }

    private Mono<ForegroundAppChangeResponse> readForegroundApplicationFromCache() {
        return this.cacheProvider
                .getForegroundAppChangeResponseCache()
                .get(FOREGROUND_APP_CACHE_KEY);
    }

    @KafkaListener(topics = "power-state-change")
    @Transactional
    public void onPowerStateChange(ConsumerRecord<String, String> mqMessage) throws KafkaConsumeFailException {
        try {
            this.handlePowerStateChange(mqMessage)
                    .subscribeOn(Schedulers.parallel())
                    .subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    public Mono<PowerStateResponse> handlePowerStateChange(ConsumerRecord<String, String> mqMessage) {
        return this.readPowerStateFromMqMessage(mqMessage)
                .doOnNext(this::processPowerStateChange)
                .doOnNext((powerStateResponse) -> {
                    if (this.shouldUpdateChannelHistory(powerStateResponse)) {
                        this.updateLatestChannelHistory()
                                .subscribeOn(Schedulers.parallel())
                                .subscribe();
                    }
                });
    }

    private Mono<Sinks.EmitResult> processPowerStateChange(PowerStateResponse powerStateResponse) {
        return this.writePowerStateToCache(powerStateResponse)
                .flatMap(this::notifyListenersAboutNewPowerState);
    }

    private Mono<PowerStateResponse> readPowerStateFromMqMessage(ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> this.objectMapper
                .readValue(message.value(), PowerStateResponse.class));
    }

    private Mono<PowerStateResponse> writePowerStateToCache(PowerStateResponse powerState) {
        return this.cacheProvider.getPowerStateResponseCache()
                .set(POWER_STATE_CACHE_KEY, powerState)
                .map(response -> powerState)
                .retry(CACHE_WRITE_TRIES)
                .log();
    }

    private Mono<Sinks.EmitResult> notifyListenersAboutNewPowerState(PowerStateResponse powerState) {
        return Mono.fromCallable(() -> new EventMessage<>(EventCategory.POWER_STATE_CHANGED, powerState))
                .flatMap(eventMessage -> this.powerStateEventService.emit(eventMessage, eventMessage.getCategory()))
                .log();
    }

    private boolean shouldUpdateChannelHistory(PowerStateResponse response) {
        return response.getState() == PowerState.SUSPEND;
    }

    private Mono<ChannelHistory> writeChannelHistoryWithCurrentDateAsEndToDatabase(ChannelHistory channelHistory) {
        return Mono.fromCallable(() -> {
            if (channelHistory.isNew()) {
                channelHistory.endViewNow();
                this.channelHistoryRepository.save(channelHistory)
                        .subscribeOn(Schedulers.parallel())
                        .subscribe();
            }
            return channelHistory;
        });
    }

    @KafkaListener(topics = "foreground-app-change")
    public void onForegroundAppChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            this.handleForegroundAppChange(message).subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    private Mono<ChannelHistory> handleForegroundAppChange(ConsumerRecord<String, String> message) {
        // TODO: appId is an empty string just before the TV turns off
        //  - the same would happen when the TV state changes to an inactive state as below
        return this.readForegroundAppChangeMessageFromMq(message)
                .doOnNext(this::writeForegroudApplicationToCache)
                .flatMap(event -> isTvRunningThirdPartyApplication(event)
                        ? this.updateLatestChannelHistory()
                        : this.createNewChannelHistoryWithCurrentlyRunningApplication(event));
    }

    private Mono<ForegroundAppChangeResponse> writeForegroudApplicationToCache(ForegroundAppChangeResponse response) {
        return this.cacheProvider.getForegroundAppChangeResponseCache()
                .set(FOREGROUND_APP_CACHE_KEY, response)
                .map(ignored -> response)
                .retry(CACHE_WRITE_TRIES)
                .log();
    }

    private Mono<ForegroundAppChangeResponse> readForegroundAppChangeMessageFromMq(
            ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> this.objectMapper
                .readValue(message.value(), ForegroundAppChangeResponse.class));
    }

    private boolean isTvRunningThirdPartyApplication(ForegroundAppChangeResponse response) {
        return !response.getAppId().equals(WebOSApplication.TV);
    }

    private Mono<ChannelHistory> updateLatestChannelHistory() {
        return this.readLatestChannelHistoryFromDatabase()
                .map(ChannelHistory::endViewNow)
                .flatMap(this.channelHistoryRepository::save)
                .flatMap(this::writeChannelHistoryToCache)
                .flatMap(this::notifyListeners);
    }

    private Mono<ChannelHistory> createNewChannelHistoryWithCurrentlyRunningApplication(
            ForegroundAppChangeResponse foregroundAppChangeResponse) {
        return ChannelHistory
                .fromForegroundApplication(foregroundAppChangeResponse)
                .flatMap(this.channelHistoryRepository::save)
                .flatMap(this::writeChannelHistoryToCache)
                .flatMap(this::notifyListeners);
    }

    /**
     * Sets the latest channel history entry in the cache and notifies the listeners about it
     * @param channelHistory Channel history object to place into the cache and notify the listeners about
     * @return Channel history object that has been passed as an argument
     */
    private Mono<ChannelHistory> writeChannelHistoryToCache(ChannelHistory channelHistory) {
        return this.cacheProvider
                .getChannelHistoryCache()
                .set(TV_CHANNEL_HISTORY_KEY, channelHistory)
                .map(result -> channelHistory);
    }

    private Mono<ChannelHistory> notifyListeners(ChannelHistory channelHistory) {
        return Mono.fromCallable(() -> new EventMessage<>(EventCategory.CHANNEL_HISTORY_CHANGED, channelHistory))
                .map(eventMessage -> this.channelHistoryEventService.getEventStream().tryEmitNext(eventMessage))
                .map(ignored -> channelHistory);
    }
}
