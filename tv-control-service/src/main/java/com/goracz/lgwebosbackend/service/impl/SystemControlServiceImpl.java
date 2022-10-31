package com.goracz.lgwebosbackend.service.impl;

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

    private final ReactiveRedisTemplate<String, SoftwareInformationResponse> redisTemplate;

    private final ReactiveValueOperations<String, SoftwareInformationResponse> reactiveValueOps;

    private final ReactiveRedisTemplate<String, PowerStateResponse> powerStateRedisTemplate;

    private final ReactiveValueOperations<String, PowerStateResponse> powerStateReactiveValueOps;

    public SystemControlServiceImpl(EventService<EventMessage<PowerStateResponse>> eventService, WebClient webClient,
            ReactiveRedisTemplate<String, SoftwareInformationResponse> redisTemplate,
            ReactiveRedisTemplate<String, PowerStateResponse> powerStateRedisTemplate) {
        this.eventService = eventService;
        this.webClient = webClient;
        this.redisTemplate = redisTemplate;
        this.reactiveValueOps = this.redisTemplate.opsForValue();
        this.powerStateRedisTemplate = powerStateRedisTemplate;
        this.powerStateReactiveValueOps = this.powerStateRedisTemplate.opsForValue();
    }

    @Override
    public Mono<SoftwareInformationResponse> getSoftwareInformation() {
        return this.reactiveValueOps.get(SOFTWARE_INFORMATION_CACHE_KEY)
                .switchIfEmpty(
                        this.webClient
                                .get()
                                .uri("/system/info")
                                .retrieve()
                                .bodyToMono(SoftwareInformationResponse.class))
                                .retry(INTERFACE_REQUEST_TRIES)
                                .log()
                .map(response -> {
                    this.reactiveValueOps
                            .set(SOFTWARE_INFORMATION_CACHE_KEY, response)
                            .retry(CACHE_WRITE_TRIES)
                            .log()
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe();

                    return response;
                });
    }

    public Mono<PowerStateResponse> getPowerState() {
        return this.powerStateReactiveValueOps.get(POWER_STATE_CACHE_KEY)
                .switchIfEmpty(
                        this.webClient
                                .get()
                                .uri("/system/power/state")
                                .retrieve()
                                .bodyToMono(PowerStateResponse.class))
                                .retry(INTERFACE_REQUEST_TRIES)
                                .log()
                .map(response -> {
                    this.powerStateReactiveValueOps
                            .set(POWER_STATE_CACHE_KEY, response)
                            .retry(CACHE_WRITE_TRIES)
                            .log()
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe();

                    return response;
                });
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
    private void onPowerStateChange(ConsumerRecord<String, String> message) {
        try {
            Mono.fromCallable(() -> new ObjectMapper().readValue(message.value(), PowerStateResponse.class))
                    .map(response -> {
                        this.powerStateReactiveValueOps
                                .set(POWER_STATE_CACHE_KEY, response)
                                .retry(CACHE_WRITE_TRIES)
                                .log()
                                .subscribeOn(Schedulers.boundedElastic())
                                .subscribe();
                        return response;
                    })
                    .map(response ->
                            Mono.fromCallable(() -> new EventMessage<>(EventCategory.POWER_STATE_CHANGED, response))
                                    .map(eventMessage -> this.eventService.getEventStream().tryEmitNext(eventMessage))
                                    .log()
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe())
                    .log()
                    .subscribeOn(Schedulers.boundedElastic())
                    .subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

}
