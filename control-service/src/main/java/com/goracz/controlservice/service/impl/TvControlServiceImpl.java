package com.goracz.controlservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.controlservice.component.RedisCacheProvider;
import com.goracz.controlservice.model.EventMessage;
import com.goracz.controlservice.model.request.SetChannelRequest;
import com.goracz.controlservice.model.response.CurrentTvChannelResponse;
import com.goracz.controlservice.model.response.TvChannelListResponse;
import com.goracz.controlservice.service.EventService;
import com.goracz.controlservice.service.TvControlService;
import com.goracz.controlservice.service.WebChannelMetadataService;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

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

    /**
     * Cache key that stores all available channels
     */
    private static final String TV_CHANNEL_LIST_CACHE_KEY = "tv:channel:list";

    private static final String TV_CHANNEL_CURRENT_KEY = "tv:channel:current";

    private final EventService<EventMessage<CurrentTvChannelResponse>> eventService;
    private final WebClient webClient;
    private final WebChannelMetadataService channelMetadataService;
    private final RedisCacheProvider cacheProvider;
    private final ObjectMapper objectMapper;

    public TvControlServiceImpl(final EventService<EventMessage<CurrentTvChannelResponse>> eventService,
            final WebClient webClient,
            final WebChannelMetadataService channelMetadataService,
            final RedisCacheProvider cacheProvider,
            final ObjectMapper objectMapper) {
        this.eventService = eventService;
        this.webClient = webClient;
        this.channelMetadataService = channelMetadataService;
        this.cacheProvider = cacheProvider;
        this.objectMapper = objectMapper;
    }

    @Override
    public Mono<TvChannelListResponse> getChannelList() {
        return this.getChannelListFromCache()
                .switchIfEmpty(this.getChannelListFromTv())
                .flatMap(response -> this.channelMetadataService.populate(response.getChannelList())
                        .collectList()
                        .map(TvChannelListResponse::fromListOfChannels)
                        .flatMap(this::writeChannelListToCache)
                        .publishOn(Schedulers.parallel()))
                .publishOn(Schedulers.parallel());
    }

    private Mono<TvChannelListResponse> getChannelListFromCache() {
        return this.cacheProvider
                .getTvChannelListResponseCache()
                .get(TV_CHANNEL_LIST_CACHE_KEY)
                .publishOn(Schedulers.immediate());
    }

    private Mono<TvChannelListResponse> getChannelListFromTv() {
        return this.webClient
                .get()
                .uri("/tv/channels")
                .retrieve()
                .bodyToMono(TvChannelListResponse.class)
                .log()
                .publishOn(Schedulers.immediate());
    }

    private Mono<TvChannelListResponse> writeChannelListToCache(final TvChannelListResponse populatedChannels) {
        return this.cacheProvider.getTvChannelListResponseCache()
                .set(TV_CHANNEL_LIST_CACHE_KEY, populatedChannels)
                .map(response -> populatedChannels)
                .retry(CACHE_WRITE_TRIES)
                .thenReturn(populatedChannels)
                .publishOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<CurrentTvChannelResponse> getCurrentChannel() {
        return this.getCurrentChannelFromCache()
                .switchIfEmpty(this.getCurrentChannelFromTv())
                .flatMap(this::writeCurrentChannelToCache);
    }

    private Mono<CurrentTvChannelResponse> getCurrentChannelFromCache() {
        return this.cacheProvider.getCurrentTvChannelCache()
                .get(TV_CHANNEL_CURRENT_KEY);
    }

    private Mono<CurrentTvChannelResponse> getCurrentChannelFromTv() {
        return this.webClient
                .get()
                .uri("/tv/channels/current")
                .retrieve()
                .bodyToMono(CurrentTvChannelResponse.class);
    }

    private Mono<CurrentTvChannelResponse> writeCurrentChannelToCache(final CurrentTvChannelResponse currentChannel) {
        return this.cacheProvider.getCurrentTvChannelCache()
                .set(TV_CHANNEL_CURRENT_KEY, currentChannel)
                .map(response -> currentChannel)
                .retry(CACHE_WRITE_TRIES)
                .publishOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<Void> goToNextChannel() {
        return this.webClient
                .post()
                .uri("/tv/channels/next")
                .retrieve()
                .bodyToMono(Void.class)
                .retry(HTTP_RETRY_TRIES)
                .log();
    }

    @Override
    public Mono<Void> goToPreviousChannel() {
        return this.webClient
                .post()
                .uri("/tv/channels/previous")
                .retrieve()
                .bodyToMono(Void.class)
                .retry(HTTP_RETRY_TRIES)
                .log();
    }

    @Override
    public Mono<Void> setChannel(final String channelId) {
        return this.webClient
                .post()
                .uri("/tv/channels")
                .bodyValue(SetChannelRequest.builder().channelId(channelId).build())
                .retrieve()
                .bodyToMono(Void.class)
                .retry(HTTP_RETRY_TRIES)
                .log();
    }
}
