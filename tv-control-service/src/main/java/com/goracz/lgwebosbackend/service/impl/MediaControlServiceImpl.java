package com.goracz.lgwebosbackend.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.lgwebosbackend.dto.media.volume.SetVolumeDto;
import com.goracz.lgwebosbackend.exception.KafkaConsumeFailException;
import com.goracz.lgwebosbackend.model.EventCategory;
import com.goracz.lgwebosbackend.model.EventMessage;
import com.goracz.lgwebosbackend.model.response.GetVolumeResponse;
import com.goracz.lgwebosbackend.service.EventService;
import com.goracz.lgwebosbackend.service.MediaControlService;
import lombok.Getter;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

@Service
public class MediaControlServiceImpl implements MediaControlService {

    /**
     * The number of tries to write the given API response to cache
     * in case of failure of the initial try.
     */
    private static final int CACHE_WRITE_TRIES = 3;

    private static final String MEDIA_VOLUME_CACHE_KEY = "media:volume";

    private final EventService<EventMessage<GetVolumeResponse>> eventService;

    private final WebClient webClient;

    private final ReactiveRedisTemplate<String, GetVolumeResponse> redisTemplate;

    private final ReactiveValueOperations<String, GetVolumeResponse> reactiveValueOps;

    @Getter
    private final Sinks.Many<GetVolumeResponse> volumeStream = Sinks.many().multicast().onBackpressureBuffer();

    public MediaControlServiceImpl(EventService<EventMessage<GetVolumeResponse>> eventService, WebClient webClient,
            ReactiveRedisTemplate<String, GetVolumeResponse> redisTemplate) {
        this.eventService = eventService;
        this.webClient = webClient;
        this.redisTemplate = redisTemplate;
        this.reactiveValueOps = this.redisTemplate.opsForValue();
    }

    @Override
    public Mono<GetVolumeResponse> getVolume() {
        return this.reactiveValueOps.get(MEDIA_VOLUME_CACHE_KEY)
                .switchIfEmpty(
                        this.webClient
                                .get()
                                .uri("/media/volume")
                                .retrieve()
                                .bodyToMono(GetVolumeResponse.class))
                                .log()
                .map(response -> {
                    this.reactiveValueOps
                            .set(MEDIA_VOLUME_CACHE_KEY, response)
                            .retry(CACHE_WRITE_TRIES)
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe();

                    return response;
                });
    }

    @Override
    public Mono<Object> setVolume(SetVolumeDto setVolumeDto) {
        return this.webClient
                .post()
                .uri("/media/volume")
                .bodyValue(setVolumeDto)
                .retrieve()
                .bodyToMono(Object.class)
                .log();
    }

    @KafkaListener(topics = "volume-change")
    public void onVolumeChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            Mono.fromCallable(() -> new ObjectMapper().readValue(message.value(), GetVolumeResponse.class))
                    .log()
                    .map(response -> {
                        this.reactiveValueOps
                                .set(MEDIA_VOLUME_CACHE_KEY, response)
                                .retry(CACHE_WRITE_TRIES)
                                .subscribeOn(Schedulers.boundedElastic())
                                .subscribe();
                        return response;
                    })
                    .map(response -> Mono.fromCallable(() -> new EventMessage<>(EventCategory.VOLUME_CHANGED, response))
                            .map(eventMessage -> this.eventService.getEventStream().tryEmitNext(eventMessage))
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe())
                    .subscribeOn(Schedulers.boundedElastic())
                    .subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }

    }

}
