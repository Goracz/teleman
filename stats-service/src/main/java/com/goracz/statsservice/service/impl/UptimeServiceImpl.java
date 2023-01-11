package com.goracz.statsservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.statsservice.component.RedisCacheProvider;
import com.goracz.statsservice.entity.UptimeLog;
import com.goracz.statsservice.exception.KafkaConsumeFailException;
import com.goracz.statsservice.model.response.EventCategory;
import com.goracz.statsservice.model.response.EventMessage;
import com.goracz.statsservice.model.response.PowerStateResponse;
import com.goracz.statsservice.repository.ReactiveUptimeRepository;
import com.goracz.statsservice.service.EventService;
import com.goracz.statsservice.service.UptimeService;
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
    private static final String LATEST_UPTIME_LOG_CACHE_KEY = "uptime-log:latest";
    private final ReactiveUptimeRepository uptimeRepository;
    private final RedisCacheProvider cacheProvider;
    private final EventService<EventMessage<UptimeLog>> eventService;

    public UptimeServiceImpl(ReactiveUptimeRepository uptimeRepository,
                             RedisCacheProvider cacheProvider,
                             EventService<EventMessage<UptimeLog>> eventService) {
        this.uptimeRepository = uptimeRepository;
        this.cacheProvider = cacheProvider;
        this.eventService = eventService;
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<UptimeLog> getLatestUptimeLog() {
        return this.readLatestUptimeLogFromCache()
                .switchIfEmpty(this.readLatestUptimeLogFromDatabase());
    }

    private Mono<UptimeLog> readLatestUptimeLogFromCache() {
        return this.cacheProvider
                .getUptimeLogCache()
                .get(LATEST_UPTIME_LOG_CACHE_KEY);
    }

    private Mono<UptimeLog> readLatestUptimeLogFromDatabase() {
        return this.uptimeRepository.findFirstByOrderByTurnOnTimeDesc();
    }

    @KafkaListener(topics = "power-state-change")
    @Transactional
    public void onPowerStateChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            this.handlePowerStateChange(message).subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    private Mono<PowerStateResponse> handlePowerStateChange(ConsumerRecord<String, String> message) {
        return this.readPowerStateFromMqMessage(message)
                .doOnNext(powerStateResponse -> {
                    if (powerStateResponse.hasTvTurnedOn() && !this.systemRecoveredFromError(powerStateResponse)) {
                        // The power state has changed to ON, so we need to create a new UptimeLog
                        // with the current time as the turn on time
                        this.writeNewUptimeLogEntry()
                                .subscribeOn(Schedulers.parallel())
                                .subscribe();
                    } else if (powerStateResponse.hasTvTurnedOff()) {
                        // The power state has changed to OFF, so the latest uptime log should be
                        // updated with the turn-off time.
                        this.updateLatestUptimeLogEntry()
                                .subscribeOn(Schedulers.parallel())
                                .subscribe();
                    } else if (powerStateResponse.hasTvTurnedOn() && this.systemRecoveredFromError(powerStateResponse)) {
                        // The power state has changed to ON while the system thinks it is already ON.
                        this.updateLatestUptimeLogEntry()
                                .map(result -> this.writeNewUptimeLogEntry())
                                .subscribeOn(Schedulers.parallel())
                                .subscribe();
                    }
                });
    }

    private Mono<PowerStateResponse> readPowerStateFromMqMessage(ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> new ObjectMapper().readValue(message.value(), PowerStateResponse.class));
    }

    private Mono<UptimeLog> writeToCache(UptimeLog uptimeLog) {
        return this.cacheProvider
                .getUptimeLogCache()
                .set(LATEST_UPTIME_LOG_CACHE_KEY, uptimeLog)
                .map(result -> uptimeLog)
                .retry(CACHE_WRITE_TRIES);
    }

    private Mono<UptimeLog> readLastFromCache() {
        return this.cacheProvider
                .getUptimeLogCache()
                .get(LATEST_UPTIME_LOG_CACHE_KEY);
    }

    private Mono<UptimeLog> readLastFromDatabase() {
        return this.uptimeRepository.findFirstByOrderByTurnOnTimeDesc();
    }

    private boolean systemRecoveredFromError(PowerStateResponse powerStateResponse) {
        return Boolean.TRUE.equals(this.getLatestUptimeLog()
                .map(latestUptimeLogEntry -> latestUptimeLogEntry.getTurnOffTime() == null
                        && powerStateResponse.hasTvTurnedOn()).block());
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

    private Mono<Sinks.EmitResult> notifyListenersAboutUptimeChange(UptimeLog uptimeLog) {
        return Mono.fromCallable(() -> new EventMessage<>(EventCategory.UPTIME_LOG_CHANGED, uptimeLog))
                .flatMap(eventMessage -> this.eventService.emit(eventMessage, eventMessage.getCategory()));
    }
}
