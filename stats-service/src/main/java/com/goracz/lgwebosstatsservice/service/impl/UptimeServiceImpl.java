package com.goracz.lgwebosstatsservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.lgwebosstatsservice.entity.UptimeLog;
import com.goracz.lgwebosstatsservice.exception.KafkaConsumeFailException;
import com.goracz.lgwebosstatsservice.model.response.PowerState;
import com.goracz.lgwebosstatsservice.model.response.PowerStateResponse;
import com.goracz.lgwebosstatsservice.repository.ReactiveUptimeRepository;
import com.goracz.lgwebosstatsservice.service.CacheManager;
import com.goracz.lgwebosstatsservice.service.UptimeService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.ZonedDateTime;

@Service
public class UptimeServiceImpl implements UptimeService {
    private static final int CACHE_WRITE_TRIES = 3;
    private static final String LATEST_UPTIME_LOG_CACHE_KEY = "uptime-log:latest";
    private final ReactiveUptimeRepository uptimeRepository;
    private final CacheManager<String, UptimeLog> uptimeLogCacheManager;

    public UptimeServiceImpl(ReactiveUptimeRepository uptimeRepository,
                             CacheManager<String, UptimeLog> uptimeLogCacheManager) {
        this.uptimeRepository = uptimeRepository;
        this.uptimeLogCacheManager = uptimeLogCacheManager;
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<UptimeLog> getLatestUptimeLog() {
        return this.uptimeRepository.findFirstByOrderByTurnOnTimeDesc().log();
    }

    @KafkaListener(topics = "power-state-change")
    @Transactional
    public void onPowerStateChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            Mono.fromCallable(ZonedDateTime::now)
                    .log()
                    .subscribeOn(Schedulers.boundedElastic())
                    .subscribe(now ->
                            Mono.fromCallable(() -> new ObjectMapper().readValue(
                                        message.value(), PowerStateResponse.class)
                                    ).map(powerStateResponse -> {
                                        if (powerStateResponse.getState().equals(PowerState.ACTIVE)
                                                && powerStateResponse.isSubscribed()) {
                                            // The power state has changed to ON, so we need to create a new UptimeLog
                                            // with the current time as the turn on time
                                            Mono.fromCallable(() -> UptimeLog
                                                            .builder()
                                                            .turnOnTime(now)
                                                            .build())
                                                    .flatMap(this.uptimeRepository::save)
                                                    .map(savedUptimeLog -> {
                                                        this.uptimeLogCacheManager
                                                                .write(LATEST_UPTIME_LOG_CACHE_KEY, savedUptimeLog)
                                                                .retry(CACHE_WRITE_TRIES)
                                                                .subscribeOn(Schedulers.boundedElastic())
                                                                .subscribe();
                                                        return savedUptimeLog;
                                                    })
                                                    .log()
                                                    .subscribeOn(Schedulers.boundedElastic())
                                                    .subscribe();
                                        } else if (powerStateResponse.getState().equals(PowerState.SUSPEND)) {
                                            // The power state has changed to OFF, so the latest uptime log should be
                                            // updated with the turn-off time.
                                            this.uptimeLogCacheManager.read(LATEST_UPTIME_LOG_CACHE_KEY)
                                                    .retry(3)
                                                    .switchIfEmpty(this.uptimeRepository.findFirstByOrderByTurnOnTimeDesc())
                                                    .map(latestUptimeLog -> {
                                                        latestUptimeLog.setTurnOffTime(now);
                                                        return latestUptimeLog;
                                                    })
                                                    .flatMap(this.uptimeRepository::save)
                                                    .map(savedUptimeLog -> {
                                                        this.uptimeLogCacheManager
                                                                .write(LATEST_UPTIME_LOG_CACHE_KEY, savedUptimeLog)
                                                                .retry(CACHE_WRITE_TRIES)
                                                                .subscribeOn(Schedulers.boundedElastic())
                                                                .subscribe();
                                                        return savedUptimeLog;
                                                    })
                                                    .log()
                                                    .subscribeOn(Schedulers.boundedElastic())
                                                    .subscribe();
                                        }
                                        return powerStateResponse;
                                    })
                                    .log()
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe()
                    );
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }
}
