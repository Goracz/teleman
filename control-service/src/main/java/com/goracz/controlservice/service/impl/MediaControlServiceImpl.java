package com.goracz.controlservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.controlservice.component.RedisCacheProvider;
import com.goracz.controlservice.dto.media.volume.SetVolumeDto;
import com.goracz.controlservice.exception.KafkaConsumeFailException;
import com.goracz.controlservice.model.EventCategory;
import com.goracz.controlservice.model.EventMessage;
import com.goracz.controlservice.model.response.GetVolumeResponse;
import com.goracz.controlservice.service.EventService;
import com.goracz.controlservice.service.MediaControlService;

import lombok.Getter;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

@Service
public class MediaControlServiceImpl implements MediaControlService {
    private static final String MEDIA_VOLUME_CACHE_KEY = "media:volume";

    private final EventService<EventMessage<GetVolumeResponse>> eventService;
    private final WebClient webClient;
    private final RedisCacheProvider cacheProvider;
    private final ObjectMapper objectMapper;
    @Getter
    private final Sinks.Many<GetVolumeResponse> volumeStream = Sinks.many().multicast().onBackpressureBuffer();

    public MediaControlServiceImpl(
            final EventService<EventMessage<GetVolumeResponse>> eventService,
            final WebClient webClient,
            final RedisCacheProvider cacheProvider,
            final ObjectMapper objectMapper) {
        this.eventService = eventService;
        this.webClient = webClient;
        this.cacheProvider = cacheProvider;
        this.objectMapper = objectMapper;
    }

    @Override
    public Mono<GetVolumeResponse> getVolume() {
        return this.readVolumeFromCache()
                .switchIfEmpty(this.getVolumeFromTv())
                .flatMap(this::writeVolumeToCache);
    }

    private Mono<GetVolumeResponse> readVolumeFromCache() {
        return this.cacheProvider.getVolumeResponseCache().get(MEDIA_VOLUME_CACHE_KEY);
    }

    private Mono<GetVolumeResponse> getVolumeFromTv() {
        return this.webClient
                .get()
                .uri("/media/volume")
                .retrieve()
                .bodyToMono(GetVolumeResponse.class);
    }

    private Mono<GetVolumeResponse> writeVolumeToCache(final GetVolumeResponse volume) {
        return this.cacheProvider
                .getVolumeResponseCache()
                .set(MEDIA_VOLUME_CACHE_KEY, volume)
                .map(response -> volume)
                .publishOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<Void> increaseVolume() {
        return this.webClient
                .post()
                .uri("/media/volume/up")
                .retrieve()
                .bodyToMono(Void.class)
                .log();
    }

    @Override
    public Mono<Void> decreaseVolume() {
        return this.webClient
                .post()
                .uri("/media/volume/down")
                .retrieve()
                .bodyToMono(Void.class)
                .log();
    }

    @Override
    public Mono<Object> setVolume(final SetVolumeDto setVolumeDto) {
        return this.webClient
                .post()
                .uri("/media/volume")
                .bodyValue(setVolumeDto)
                .retrieve()
                .bodyToMono(Object.class)
                .log();
    }

    @KafkaListener(topics = "volume-change")
    public void onVolumeChange(final ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            this.handleVolumeChange(message).subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    private Mono<Sinks.EmitResult> handleVolumeChange(final ConsumerRecord<String, String> message) {
        return this.getVolumeFromMqMessage(message)
                .flatMap(this::writeVolumeToCache)
                .flatMap(this::notifyListenersAboutVolumeChange);
    }

    private Mono<GetVolumeResponse> getVolumeFromMqMessage(final ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> this.objectMapper.readValue(message.value(), GetVolumeResponse.class))
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<Sinks.EmitResult> notifyListenersAboutVolumeChange(final GetVolumeResponse volume) {
        return Mono.fromCallable(() -> new EventMessage<>(EventCategory.VOLUME_CHANGED, volume))
                .flatMap(eventMessage -> this.eventService.emit(eventMessage, eventMessage.getCategory()))
                .publishOn(Schedulers.immediate());
    }
}
