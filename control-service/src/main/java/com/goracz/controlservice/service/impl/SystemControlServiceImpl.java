package com.goracz.controlservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.controlservice.component.RedisCacheProvider;
import com.goracz.controlservice.exception.KafkaConsumeFailException;
import com.goracz.controlservice.model.EventCategory;
import com.goracz.controlservice.model.EventMessage;
import com.goracz.controlservice.model.response.PowerStateResponse;
import com.goracz.controlservice.model.response.SoftwareInformationResponse;
import com.goracz.controlservice.service.EventService;
import com.goracz.controlservice.service.SystemControlService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

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
    private final RedisCacheProvider cacheProvider;


    public SystemControlServiceImpl(EventService<EventMessage<PowerStateResponse>> eventService,
                                    WebClient webClient,
                                    RedisCacheProvider cacheProvider) {
        this.eventService = eventService;
        this.webClient = webClient;
        this.cacheProvider = cacheProvider;
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
        return this.cacheProvider.getSoftwareInformationResponseCache().get(SOFTWARE_INFORMATION_CACHE_KEY);
    }

    private Mono<SoftwareInformationResponse> writeSoftwareInformationToCache(
            SoftwareInformationResponse softwareInformation) {
        return this.cacheProvider
                .getSoftwareInformationResponseCache()
                .set(SOFTWARE_INFORMATION_CACHE_KEY, softwareInformation)
                .map(response -> softwareInformation)
                .retry(CACHE_WRITE_TRIES)
                .log();
    }

    private Mono<PowerStateResponse> getPowerStateFromCache() {
        return this.cacheProvider.getPowerStateResponseCache().get(POWER_STATE_CACHE_KEY);
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
        return this.cacheProvider.getPowerStateResponseCache()
                .set(POWER_STATE_CACHE_KEY, powerState)
                .map(response -> powerState)
                .retry(CACHE_WRITE_TRIES)
                .log();
    }

    private Mono<Sinks.EmitResult> notifyListenersAboutNewPowerState(PowerStateResponse powerState) {
        return Mono.fromCallable(() -> new EventMessage<>(EventCategory.POWER_STATE_CHANGED, powerState))
                .flatMap(eventMessage -> this.eventService.emit(eventMessage, eventMessage.getCategory()))
                .log();
    }
}
