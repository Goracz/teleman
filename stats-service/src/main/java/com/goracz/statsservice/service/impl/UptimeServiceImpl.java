package com.goracz.statsservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.statsservice.component.RedisCacheProvider;
import com.goracz.statsservice.constant.CacheKeys;
import com.goracz.statsservice.constant.KafkaTopic;
import com.goracz.statsservice.entity.UptimeLog;
import com.goracz.statsservice.exception.KafkaConsumeFailException;
import com.goracz.statsservice.model.response.EventMessage;
import com.goracz.statsservice.model.response.ForegroundAppChangeResponse;
import com.goracz.statsservice.model.response.PowerStateResponse;
import com.goracz.statsservice.repository.ReactiveUptimeRepository;
import com.goracz.statsservice.service.EventService;
import com.goracz.statsservice.service.UptimeService;
import com.goracz.statsservice.service.WebForegroundApplicationService;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

@Service
public class UptimeServiceImpl implements UptimeService {
    private static final int CACHE_WRITE_TRIES = 3;
    private final ReactiveUptimeRepository uptimeRepository;
    private final RedisCacheProvider cacheProvider;
    private final EventService<EventMessage<PowerStateResponse>> powerStateEventService;
    private final EventService<EventMessage<UptimeLog>> uptimeLogEventService;
    private final ObjectMapper objectMapper;
    private final WebForegroundApplicationService foregroundApplicationService;

    public UptimeServiceImpl(final ReactiveUptimeRepository uptimeRepository,
                             final RedisCacheProvider cacheProvider,
                             final EventService<EventMessage<PowerStateResponse>> powerStateEventService,
                             final EventService<EventMessage<UptimeLog>> uptimeLogEventService,
                             final ObjectMapper objectMapper,
                             final WebForegroundApplicationService foregroundApplicationService) {
        this.uptimeRepository = uptimeRepository;
        this.cacheProvider = cacheProvider;
        this.powerStateEventService = powerStateEventService;
        this.uptimeLogEventService = uptimeLogEventService;
        this.objectMapper = objectMapper;
        this.foregroundApplicationService = foregroundApplicationService;
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<UptimeLog> getLatestUptimeLog() {
        return this.readLatestUptimeLogFromCache()
                .switchIfEmpty(this.readLatestUptimeLogFromDatabase().doOnNext(this::writeToCache));
    }

    private Mono<UptimeLog> readLatestUptimeLogFromCache() {
        return this.cacheProvider
                .getUptimeLogCache()
                .get(CacheKeys.LATEST_UPTIME_LOG_CACHE_KEY)
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<UptimeLog> readLatestUptimeLogFromDatabase() {
        return this.uptimeRepository
                .findFirstByOrderByTurnOnTimeDesc()
                .publishOn(Schedulers.boundedElastic());
    }

    @KafkaListener(topics = KafkaTopic.POWER_STATE_CHANGES, containerFactory = "kafkaListenerContainerFactory2")
    public void onPowerStateChange(final ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            this.handlePowerStateChange(message).subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    private Mono<PowerStateResponse> handlePowerStateChange(final ConsumerRecord<String, String> message) {
        return this.readPowerStateFromMqMessage(message)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(powerStateResponse -> this.systemRecoveredFromError(powerStateResponse)
                        .doOnNext(systemRecoveredFromError -> {
                    if (powerStateResponse.hasTvTurnedOn() && Boolean.FALSE.equals(systemRecoveredFromError)) {
                        // The power state has changed to ON, so we need to create a new UptimeLog
                        // with the current time as the turn on time
                        this.writeNewUptimeLogEntry()
                                .doOnNext(this::notifyListenersAboutUptimeChange)
                                .doOnNext(this::writeCurrentlyRunningApplicationToCache)
                                .subscribeOn(Schedulers.parallel())
                                .subscribe();
                    } else if (powerStateResponse.hasTvTurnedOff()) {
                        // The power state has changed to OFF, so the latest uptime log should be
                        // updated with the turn-off time.
                        this.updateLatestUptimeLogEntry()
                                .doOnNext(this::notifyListenersAboutUptimeChange)
                                .subscribeOn(Schedulers.parallel())
                                .subscribe();
                    } else if (powerStateResponse.hasTvTurnedOn() && Boolean.TRUE.equals(systemRecoveredFromError)) {
                        // The power state has changed to ON while the system thinks it is already ON.
                        this.updateLatestUptimeLogEntry()
                                .flatMap(result -> this.writeNewUptimeLogEntry())
                                .doOnNext(this::notifyListenersAboutUptimeChange)
                                .subscribeOn(Schedulers.parallel())
                                .subscribe();
                    }
                }).subscribe())
                .doOnNext(this::writePowerStateToCache)
                .doOnNext(this::notifyListenersAboutPowerStateChange);
    }

    private Mono<PowerStateResponse> readPowerStateFromMqMessage(final ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> this.objectMapper.readValue(message.value(), PowerStateResponse.class))
                .publishOn(Schedulers.parallel());
    }

    private Mono<UptimeLog> writeToCache(final UptimeLog uptimeLog) {
        return this.cacheProvider
                .getUptimeLogCache()
                .set(CacheKeys.LATEST_UPTIME_LOG_CACHE_KEY, uptimeLog)
                .map(result -> uptimeLog)
                .retry(CACHE_WRITE_TRIES)
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<UptimeLog> readLastFromCache() {
        return this.cacheProvider
                .getUptimeLogCache()
                .get(CacheKeys.LATEST_UPTIME_LOG_CACHE_KEY)
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<UptimeLog> readLastFromDatabase() {
        return this.uptimeRepository
                .findFirstByOrderByTurnOnTimeDesc()
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<Boolean> systemRecoveredFromError(final PowerStateResponse powerStateResponse) {
        return this.getLatestUptimeLog()
                .map(latestUptimeLogEntry -> latestUptimeLogEntry.getTurnOffTime() == null
                        && powerStateResponse.hasTvTurnedOn())
                .map(Boolean.TRUE::equals);
    }

    private Mono<UptimeLog> writeNewUptimeLogEntry() {
        return Mono.fromCallable(UptimeLog::withCurrentTime)
                .flatMap(this.uptimeRepository::save)
                .flatMap(this::writeToCache)
                .doOnNext(this::notifyListenersAboutUptimeChange);
    }

    private Mono<UptimeLog> updateLatestUptimeLogEntry() {
        return this.readLastFromCache()
                .switchIfEmpty(this.readLastFromDatabase())
                .map(UptimeLog::setTurnOffToNow)
                .flatMap(this.uptimeRepository::save)
                .flatMap(this::writeToCache)
                .doOnNext(this::notifyListenersAboutUptimeChange);
    }

    private Mono<Void> writePowerStateToCache(final PowerStateResponse powerStateResponse) {
        return this.cacheProvider
                .getPowerStateResponseCache()
                .set(CacheKeys.POWER_STATE_CACHE_KEY, powerStateResponse)
                .retry(CACHE_WRITE_TRIES)
                .then()
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<Sinks.EmitResult> notifyListenersAboutPowerStateChange(final PowerStateResponse powerStateResponse) {
        return Mono.fromCallable(() -> EventMessage.fromPowerStateResponse(powerStateResponse))
                .flatMap(this.powerStateEventService::emit)
                .publishOn(Schedulers.immediate());
    }

    private Mono<Sinks.EmitResult> notifyListenersAboutUptimeChange(final UptimeLog uptimeLog) {
        return Mono.fromCallable(() -> EventMessage.fromUptimeLog(uptimeLog))
                .flatMap(this.uptimeLogEventService::emit)
                .publishOn(Schedulers.immediate());
    }

    private Mono<ForegroundAppChangeResponse> writeCurrentlyRunningApplicationToCache(final UptimeLog uptimeLog) {
        return this.getForegroundApplication()
                .doOnNext(this::writeForegroundApplicationToCache);
    }

    private Mono<ForegroundAppChangeResponse> getForegroundApplication() {
        return this.foregroundApplicationService.getForegroundApplication();
    }

    private Mono<Void> writeForegroundApplicationToCache(
            final ForegroundAppChangeResponse foregroundAppChangeResponse) {
        return this.cacheProvider
                .getForegroundAppChangeResponseCache()
                .set(CacheKeys.FOREGROUND_APP_CACHE_KEY, foregroundAppChangeResponse)
                .retry(CACHE_WRITE_TRIES)
                .then()
                .publishOn(Schedulers.boundedElastic());
    }
}
