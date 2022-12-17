package com.goracz.lgwebosbackend.service.impl;

import com.goracz.lgwebosbackend.service.CacheManager;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.lgwebosbackend.exception.KafkaConsumeFailException;
import com.goracz.lgwebosbackend.model.EventCategory;
import com.goracz.lgwebosbackend.model.EventMessage;
import com.goracz.lgwebosbackend.model.response.PowerStateResponse;
import com.goracz.lgwebosbackend.model.response.SoftwareInformationResponse;
import com.goracz.lgwebosbackend.service.EventService;
import com.goracz.lgwebosbackend.service.SystemControlService;

import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

@Service
public class SystemControlServiceImpl implements SystemControlService {

    /**
     * The number of tries to write the given API response to cache
     * in case of failure of the initial try.
     */
    private static final int CACHE_WRITE_TRIES = 3;

    /**
     * The number of the tries to send an HTTP request to the LG WebOS interface
     * in case of failure of the initial try.
     */
    private static final int INTERFACE_REQUEST_TRIES = 3;

    private static final String SOFTWARE_INFORMATION_CACHE_KEY = "system:software";

    private static final String POWER_STATE_CACHE_KEY = "system:power:state";

    private final EventService<EventMessage<PowerStateResponse>> eventService;

    private final WebClient webClient;

    private final CacheManager<String, SoftwareInformationResponse> softwareInfoCacheManager;

    private final CacheManager<String, PowerStateResponse> powerStateCacheManager;

    public SystemControlServiceImpl(EventService<EventMessage<PowerStateResponse>> eventService,
                                    WebClient webClient,
                                    CacheManager<String, SoftwareInformationResponse> softwareInfoCacheManager,
                                    CacheManager<String, PowerStateResponse> powerStateCacheManager) {
        this.eventService = eventService;
        this.webClient = webClient;
        this.softwareInfoCacheManager = softwareInfoCacheManager;
        this.powerStateCacheManager = powerStateCacheManager;
    }

    @Override
    public Mono<SoftwareInformationResponse> getSoftwareInformation() {
        return this.getSoftwareInformationFromCache()
                .switchIfEmpty(this.getSoftwareInformationFromTv())
                .flatMap(this::writeSoftwareInformationToCache);
    }

    public Mono<PowerStateResponse> getPowerState() {
        return this.getPowerStateFromCache()
                .switchIfEmpty(this.getPowerStateFromTv())
                .flatMap(this::writePowerStateToCache);
    }

    @Override
    public Mono<Void> turnOff() {
        return this.webClient
                .post()
                .uri("/system/power/off")
                .retrieve()
                .bodyToMono(Void.class)
                .retry(INTERFACE_REQUEST_TRIES)
                .log();
    }

    @Override
    public Mono<Void> turnOn() {
        return this.webClient
                .post()
                .uri("/system/power/on")
                .retrieve()
                .bodyToMono(Void.class)
                .retry(INTERFACE_REQUEST_TRIES)
                .log();
    }

    @KafkaListener(topics = "power-state-change")
    private void onPowerStateChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            this.handlePowerStateChange(message)
                    .subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    private Mono<SoftwareInformationResponse> getSoftwareInformationFromTv() {
        return this.webClient
                .get()
                .uri("/system/info")
                .retrieve()
                .bodyToMono(SoftwareInformationResponse.class)
                .retry(INTERFACE_REQUEST_TRIES)
                .log();
    }

    private Mono<SoftwareInformationResponse> getSoftwareInformationFromCache() {
        return this.softwareInfoCacheManager.read(SOFTWARE_INFORMATION_CACHE_KEY);
    }

    private Mono<SoftwareInformationResponse> writeSoftwareInformationToCache(
            SoftwareInformationResponse softwareInformation) {
        return this.softwareInfoCacheManager
                .write(SOFTWARE_INFORMATION_CACHE_KEY, softwareInformation)
                .retry(CACHE_WRITE_TRIES)
                .log();
    }

    private Mono<PowerStateResponse> getPowerStateFromCache() {
        return this.powerStateCacheManager.read(POWER_STATE_CACHE_KEY);
    }

    private Mono<PowerStateResponse> getPowerStateFromTv() {
        return this.webClient
                .get()
                .uri("/system/power/state")
                .retrieve()
                .bodyToMono(PowerStateResponse.class)
                .retry(INTERFACE_REQUEST_TRIES)
                .log();
    }

    private Mono<Sinks.EmitResult> handlePowerStateChange(ConsumerRecord<String, String> message) {
        return this.getPowerStateFromMqMessage(message)
                .flatMap(this::writePowerStateToCache)
                .flatMap(this::notifyListenersAboutNewPowerState);
    }

    private Mono<PowerStateResponse> getPowerStateFromMqMessage(ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> new ObjectMapper().readValue(message.value(), PowerStateResponse.class));
    }

    private Mono<PowerStateResponse> writePowerStateToCache(PowerStateResponse powerState) {
        return this.powerStateCacheManager
                .write(POWER_STATE_CACHE_KEY, powerState)
                .retry(CACHE_WRITE_TRIES)
                .log();
    }

    private Mono<Sinks.EmitResult> notifyListenersAboutNewPowerState(PowerStateResponse powerState) {
        return Mono.fromCallable(() -> new EventMessage<>(EventCategory.POWER_STATE_CHANGED, powerState))
                .flatMap(eventMessage -> this.eventService.emit(eventMessage, eventMessage.getCategory()))
                .log();
    }
}
