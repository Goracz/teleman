package com.goracz.lgwebosstatsservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.lgwebosstatsservice.entity.ChannelHistory;
import com.goracz.lgwebosstatsservice.exception.KafkaConsumeFailException;
import com.goracz.lgwebosstatsservice.model.request.ChannelHistoryRequest;
import com.goracz.lgwebosstatsservice.model.response.CurrentTvChannelResponse;
import com.goracz.lgwebosstatsservice.repository.ReactiveSortingChannelHistoryRepository;
import com.goracz.lgwebosstatsservice.service.ChannelHistoryService;
import com.goracz.lgwebosstatsservice.service.WebChannelMetadataService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
public class ChannelHistoryServiceImpl implements ChannelHistoryService {

    private static final String TV_CHANNEL_HISTORY_KEY = "tv:channel:history";
    private static final int RETRY_TRIES = 3;

    private final ReactiveSortingChannelHistoryRepository channelHistoryRepository;
    private final WebChannelMetadataService webChannelMetadataService;
    private final ReactiveValueOperations<String, ChannelHistory> channelHistoryReactiveValueOps;

    public ChannelHistoryServiceImpl(ReactiveSortingChannelHistoryRepository channelHistoryRepository,
                                     WebChannelMetadataService webChannelMetadataService,
                                     ReactiveRedisTemplate<String, ChannelHistory> channelHistoryRedisTemplate
    ) {
        this.channelHistoryRepository = channelHistoryRepository;
        this.webChannelMetadataService = webChannelMetadataService;
        this.channelHistoryReactiveValueOps = channelHistoryRedisTemplate.opsForValue();
    }

    @Override
    @Transactional(readOnly = true)
    public Flux<ChannelHistory> getByTimeRange(ChannelHistoryRequest channelHistoryRequest) {
        return this.channelHistoryRepository
                .findAllByStartBetween(channelHistoryRequest.getStart().atStartOfDay(ZoneId.systemDefault()),
                        channelHistoryRequest.getEnd().atStartOfDay(ZoneId.systemDefault()))
                .flatMap(channelHistory -> this.webChannelMetadataService
                        .getChannelMetadataByChannelName(channelHistory.getChannelName())
                        .map(channelMetadataResponse -> {
                            channelHistory.setChannelLogoUrl(channelMetadataResponse.getChannelLogoUrl());
                            return channelHistory;
                        }));
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
            Mono.fromCallable(ZonedDateTime::now)
                    .map(now -> Mono.fromCallable(() -> new ObjectMapper().readValue(message.value(),
                                    CurrentTvChannelResponse.class))
                            .log()
                            .map(response -> this.channelHistoryReactiveValueOps
                                    .get(TV_CHANNEL_HISTORY_KEY)
                                    .switchIfEmpty(this.channelHistoryRepository.findFirstByOrderByStartDesc())
                                    .switchIfEmpty(Mono.just(ChannelHistory.builder().build()))
                                    .map(latestChannelHistoryEntry -> {
                                        if (latestChannelHistoryEntry.getChannelId() != null
                                                && latestChannelHistoryEntry.getEnd() == null) {
                                            // A channel is already in the cache, the current channel's end
                                            // time has to be set to now.
                                            latestChannelHistoryEntry.setEnd(now);

                                            this.channelHistoryRepository
                                                    .save(latestChannelHistoryEntry)
                                                    .retry(RETRY_TRIES)
                                                    .log()
                                                    .map(savedChannelHistoryEntry ->
                                                        this.webChannelMetadataService.getChannelMetadataByChannelName(response.getChannelName())
                                                                .log()
                                                                .flatMap(channelMetadata ->
                                                                        this.channelHistoryRepository.save(ChannelHistory
                                                                                .builder()
                                                                                .channelId(response.getChannelId())
                                                                                .channelName(response.getChannelName())
                                                                                .channelCategory(channelMetadata.getChannelCategory())
                                                                                .start(now)
                                                                                .build()))
                                                                .log()
                                                                .map(channelHistory -> this.channelHistoryReactiveValueOps
                                                                        .set(TV_CHANNEL_HISTORY_KEY, channelHistory)
                                                                        .retry(RETRY_TRIES)
                                                                        .log()
                                                                        .subscribeOn(Schedulers.boundedElastic())
                                                                        .subscribe())
                                                                .subscribeOn(Schedulers.boundedElastic())
                                                                .subscribe())
                                                    .subscribeOn(Schedulers.boundedElastic())
                                                    .subscribe();
                                        } else {
                                            // A channel is not in the cache yet, so the current channel's start
                                            // time has to be set to now.
                                            this.webChannelMetadataService
                                                    .getChannelMetadataByChannelName(response.getChannelName())
                                                    .map(channelMetadata -> this.channelHistoryRepository
                                                            .save(ChannelHistory
                                                                    .builder()
                                                                    .channelId(response.getChannelId())
                                                                    .channelName(response.getChannelName())
                                                                    .channelCategory(channelMetadata.getChannelCategory())
                                                                    .start(now)
                                                                    .build())
                                                            .map(persistedChannelHistory -> this.channelHistoryReactiveValueOps
                                                                    .set(TV_CHANNEL_HISTORY_KEY, persistedChannelHistory)
                                                                    .retry(RETRY_TRIES)
                                                                    .subscribeOn(Schedulers.boundedElastic())
                                                                    .subscribe())
                                                            .subscribeOn(Schedulers.boundedElastic())
                                                            .subscribe())
                                                    .subscribeOn(Schedulers.boundedElastic())
                                                    .subscribe();
                                        }
                                        return latestChannelHistoryEntry;
                                    })
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe())
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe())
                    .subscribeOn(Schedulers.boundedElastic())
                    .subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }
}
