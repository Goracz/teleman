package com.goracz.statsservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.statsservice.entity.ChannelHistory;
import com.goracz.statsservice.exception.KafkaConsumeFailException;
import com.goracz.statsservice.model.WebOSApplication;
import com.goracz.statsservice.model.request.ChannelHistoryRequest;
import com.goracz.lgwebosstatsservice.model.response.*;
import com.goracz.statsservice.model.response.*;
import com.goracz.statsservice.repository.ReactiveSortingChannelHistoryRepository;
import com.goracz.statsservice.service.CacheManager;
import com.goracz.statsservice.service.ChannelHistoryService;
import com.goracz.statsservice.service.EventService;
import com.goracz.statsservice.service.WebChannelMetadataService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.ZoneId;

@Service
public class ChannelHistoryServiceImpl implements ChannelHistoryService {

    private static final String TV_CHANNEL_HISTORY_KEY = "tv:channel:history";
    private static final int RETRY_TRIES = 3;

    private final EventService<EventMessage<ChannelHistory>> eventService;
    private final ReactiveSortingChannelHistoryRepository channelHistoryRepository;
    private final WebChannelMetadataService webChannelMetadataService;
    private final CacheManager<String, ChannelHistory> channelHistoryCacheManager;

    public ChannelHistoryServiceImpl(EventService<EventMessage<ChannelHistory>> eventService,
                                     ReactiveSortingChannelHistoryRepository channelHistoryRepository,
                                     WebChannelMetadataService webChannelMetadataService,
                                     CacheManager<String, ChannelHistory> channelHistoryCacheManager
    ) {
        this.eventService = eventService;
        this.channelHistoryRepository = channelHistoryRepository;
        this.webChannelMetadataService = webChannelMetadataService;
        this.channelHistoryCacheManager = channelHistoryCacheManager;
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
        return this.webChannelMetadataService
                .getChannelMetadataByChannelName(channelHistory.getChannelName())
                .map(metadata -> ChannelHistory.withMetadata(channelHistory, metadata));
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
                .map(response -> this.readLastChannelHistoryEntryFromCache()
                        .switchIfEmpty(this.readLastChannelHistoryEntryFromDatabase())
                        .switchIfEmpty(ChannelHistory.empty())
                        .doOnNext(latestChannelHistoryEntry -> {
                            if (latestChannelHistoryEntry.isNew()) {
                                // A channel is already in the cache, the current channel's end
                                // time has to be set to now.
                                this.updateLatestChannelHistory(latestChannelHistoryEntry)
                                        .subscribeOn(Schedulers.boundedElastic())
                                        .subscribe();
                            } else {
                                // A channel is not in the cache yet, so the current channel's start
                                // time has to be set to now.
                                this.addNewChannelHistory(response)
                                        .subscribeOn(Schedulers.boundedElastic())
                                        .subscribe();
                            }
                        })
                        .subscribeOn(Schedulers.boundedElastic())
                        .subscribe())
                .then();
    }

    private Mono<ChannelHistory> readLastChannelHistoryEntryFromCache() {
        return this.channelHistoryCacheManager.read(TV_CHANNEL_HISTORY_KEY);
    }

    private Mono<ChannelHistory> readLastChannelHistoryEntryFromDatabase() {
        return this.channelHistoryRepository.findFirstByOrderByStartDesc();
    }

    private Mono<CurrentTvChannelResponse> readCurrentChannelFromMqMessage(ConsumerRecord<String, String> message) {
        return  Mono.fromCallable(() -> new ObjectMapper().readValue(message.value(), CurrentTvChannelResponse.class));
    }

    private Mono<Void> updateLatestChannelHistory(ChannelHistory channelHistory) {
        return Mono.fromCallable(() -> {
            channelHistory.endViewNow();
            return this.channelHistoryRepository
                    .save(channelHistory).retry(RETRY_TRIES)
                    .flatMap(this::notifyListeners)
                    .flatMap(this::populateChannelHistoryWithMetadata)
                    .flatMap(this.channelHistoryRepository::save)
                    .flatMap(this::writeChannelHistoryToCache)
                    .flatMap(this::notifyListeners);
        }).then();
    }

    private Mono<Void> addNewChannelHistory(CurrentTvChannelResponse currentChannel) {
        return this.webChannelMetadataService
                .getChannelMetadataByChannelName(currentChannel.getChannelName())
                .map(channelMetadata -> this.channelHistoryRepository
                        .save(ChannelHistory.fromCurrentChannelAndMetadata(currentChannel, channelMetadata))
                        .flatMap(this::writeChannelHistoryToCache)
                        .flatMap(this::notifyListeners))
                .then();
    }

    @KafkaListener(topics = "power-state-change")
    @Transactional
    public void onPowerStateChange(ConsumerRecord<String, String> mqMessage) throws KafkaConsumeFailException {
        try {
            this.handlePowerStateChange(mqMessage)
                    .subscribeOn(Schedulers.boundedElastic())
                    .subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    public Mono<PowerStateResponse> handlePowerStateChange(ConsumerRecord<String, String> mqMessage) {
        return this.readPowerStateFromMqMessage(mqMessage)
                .doOnNext((powerStateResponse) -> {
                    if (this.isApplicationInForeground(powerStateResponse)) {
                        this.readLatestChannelHistoryFromDatabase()
                                .map(this::writeNewChannelHistoryWithCurrentDateAsEndToDatabase)
                                .subscribeOn(Schedulers.boundedElastic())
                                .subscribe();
                    }
                });
    }

    private Mono<PowerStateResponse> readPowerStateFromMqMessage(ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> new ObjectMapper()
                .readValue(message.value(), PowerStateResponse.class));
    }

    private boolean isApplicationInForeground(PowerStateResponse response) {
        return response.getState() == PowerState.SUSPEND;
    }

    private Mono<ChannelHistory> writeNewChannelHistoryWithCurrentDateAsEndToDatabase(ChannelHistory channelHistory) {
        return Mono.fromCallable(() -> {
            if (channelHistory.isNew()) {
                channelHistory.endViewNow();
                this.channelHistoryRepository.save(channelHistory)
                        .subscribeOn(Schedulers.boundedElastic())
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
                .flatMap(event -> isApplicationInForeground(event)
                        ? this.updateLatestChannelHistory()
                        : this.createNewChannelHistoryWithCurrentDateAsStartTime());
    }

    private Mono<ForegroundAppChangeResponse> readForegroundAppChangeMessageFromMq(
            ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> new ObjectMapper()
                .readValue(message.value(), ForegroundAppChangeResponse.class));
    }

    private boolean isApplicationInForeground(ForegroundAppChangeResponse response) {
        return !response.getAppId().equals(WebOSApplication.TV) && !response.getAppId().equals(WebOSApplication.BLANK);
    }

    private Mono<ChannelHistory> updateLatestChannelHistory() {
        return this.readLatestChannelHistoryFromDatabase()
                .map(ChannelHistory::endViewNow)
                .flatMap(this.channelHistoryRepository::save)
                .flatMap(this::writeChannelHistoryToCache)
                .flatMap(this::notifyListeners);
    }

    private Mono<ChannelHistory> readLatestChannelHistoryFromCache() {
        return this.channelHistoryCacheManager.read(TV_CHANNEL_HISTORY_KEY);
    }

    private Mono<ChannelHistory> readLatestChannelHistoryFromDatabase() {
        return this.channelHistoryRepository.findFirstByOrderByStartDesc();
    }

    private Mono<ChannelHistory> createNewChannelHistoryWithCurrentDateAsStartTime() {
        return this.readLatestChannelHistoryFromCache()
                .switchIfEmpty(this.readLatestChannelHistoryFromDatabase())
                .map(ChannelHistory::fromChannelHistory)
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
        return this.channelHistoryCacheManager.write(TV_CHANNEL_HISTORY_KEY, channelHistory);
    }

    private Mono<ChannelHistory> notifyListeners(ChannelHistory channelHistory) {
        return Mono.fromCallable(() -> new EventMessage<>(EventCategory.CHANNEL_HISTORY_CHANGED, channelHistory))
                .map(eventMessage -> this.eventService.getEventStream().tryEmitNext(eventMessage))
                .map(ignored -> channelHistory);
    }
}
