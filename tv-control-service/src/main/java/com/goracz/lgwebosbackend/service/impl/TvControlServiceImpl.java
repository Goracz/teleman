package com.goracz.lgwebosbackend.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.lgwebosbackend.exception.KafkaConsumeFailException;
import com.goracz.lgwebosbackend.model.EventCategory;
import com.goracz.lgwebosbackend.model.EventMessage;
import com.goracz.lgwebosbackend.model.request.SetChannelRequest;
import com.goracz.lgwebosbackend.model.response.CurrentTvChannelResponse;
import com.goracz.lgwebosbackend.model.response.TvChannelListResponse;
import com.goracz.lgwebosbackend.service.EventService;
import com.goracz.lgwebosbackend.service.TvControlService;
import com.goracz.lgwebosbackend.service.WebChannelMetadataService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
public class TvControlServiceImpl implements TvControlService {

    /**
     * The number of tries to write the given API response to cache
     * in case of failure of the initial try.
     */
    private static final int CACHE_WRITE_TRIES = 3;

    /**
     * The number of tries to send a given HTTP request in case it fails.
     */
    private static final int HTTP_RETRY_TRIES = 3;

    private static final String TV_CHANNEL_LIST_CACHE_KEY = "tv:channel:list";
    private static final String TV_CHANNEL_CURRENT_KEY = "tv:channel:current";

    private static final String TV_CHANNEL_HISTORY_KEY = "tv:channel:history";

    private final EventService<EventMessage<CurrentTvChannelResponse>> eventService;
    private final WebClient webClient;
    private final WebChannelMetadataService channelMetadataService;
    private final ReactiveValueOperations<String, TvChannelListResponse> reactiveValueOps;
    private final ReactiveValueOperations<String, CurrentTvChannelResponse> currentTvChannelResponseReactiveValueOps;

    public TvControlServiceImpl(EventService<EventMessage<CurrentTvChannelResponse>> eventService, WebClient webClient,
            WebChannelMetadataService channelMetadataService,
            ReactiveRedisTemplate<String, TvChannelListResponse> redisTemplate,
            ReactiveRedisTemplate<String, CurrentTvChannelResponse> currentTvChannelResponseRedisTemplate
    ) {
        this.eventService = eventService;
        this.webClient = webClient;
        this.channelMetadataService = channelMetadataService;
        this.reactiveValueOps = redisTemplate.opsForValue();
        this.currentTvChannelResponseReactiveValueOps = currentTvChannelResponseRedisTemplate.opsForValue();
    }

    @Override
    public Mono<TvChannelListResponse> getChannelList() {
        return this.reactiveValueOps.get(TV_CHANNEL_LIST_CACHE_KEY)
                .switchIfEmpty(
                        this.webClient
                                .get()
                                .uri("/tv/channels")
                                .retrieve()
                                .bodyToMono(TvChannelListResponse.class))
                                .log()
                .flatMap(response -> {
                    Mono.fromCallable(response::getChannelList)
                            .flatMap(channelList ->
                                Flux.fromIterable(channelList)
                                        .flatMap(channel -> this.channelMetadataService.getChannelMetadataByChannelName(channel.getChannelName()))
                                        .collectList()
                                        .flatMap(channelMetadataList -> {
                                            for (int i = 0; i < channelMetadataList.size(); i++) {
                                                response.getChannelList().get(i).setImgUrl(channelMetadataList.get(i).getChannelLogoUrl());
                                            }
                                            return Mono.just(response);
                                        })).subscribe();
                    return Mono.just(response);
                })
                .flatMap(response -> this.reactiveValueOps.set(TV_CHANNEL_LIST_CACHE_KEY, response)
                        .retry(CACHE_WRITE_TRIES)
                        .thenReturn(response));
    }

    @Override
    public Mono<CurrentTvChannelResponse> getCurrentChannel() {
        return this.currentTvChannelResponseReactiveValueOps.get(TV_CHANNEL_CURRENT_KEY)
                .switchIfEmpty(
                        this.webClient
                                .get()
                                .uri("/tv/channels/current")
                                .retrieve()
                                .bodyToMono(CurrentTvChannelResponse.class))
                                .log()
                .map(response -> {
                    this.currentTvChannelResponseReactiveValueOps
                            .set(TV_CHANNEL_CURRENT_KEY, response)
                            .retry(CACHE_WRITE_TRIES)
                            .log()
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe();

                    return response;
                });
    }

    @Override
    public Mono<Void> setChannel(String channelId) {
        return this.webClient
                .post()
                .uri("/tv/channels")
                .bodyValue(SetChannelRequest.builder().channelId(channelId).build())
                .retrieve()
                .bodyToMono(Void.class)
                .retry(HTTP_RETRY_TRIES)
                .log();
    }

    @KafkaListener(topics = "channel-change")
    private void onChannelChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            Mono.fromCallable(() -> new ObjectMapper().readValue(message.value(), CurrentTvChannelResponse.class))
                    .map(response -> {
                        this.currentTvChannelResponseReactiveValueOps
                                .set(TV_CHANNEL_CURRENT_KEY, response)
                                .retry(CACHE_WRITE_TRIES)
                                .log()
                                .subscribeOn(Schedulers.boundedElastic())
                                .subscribe();

                        return response;
                    })
                    .map(response ->
                            Mono.fromCallable(() -> new EventMessage<>(EventCategory.CHANNEL_CHANGED, response))
                                    .map(eventMessage -> this.eventService.getEventStream().tryEmitNext(eventMessage))
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
