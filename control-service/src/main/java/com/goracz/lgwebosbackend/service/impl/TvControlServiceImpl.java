package com.goracz.lgwebosbackend.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.lgwebosbackend.exception.KafkaConsumeFailException;
import com.goracz.lgwebosbackend.model.EventCategory;
import com.goracz.lgwebosbackend.model.EventMessage;
import com.goracz.lgwebosbackend.model.request.SetChannelRequest;
import com.goracz.lgwebosbackend.model.response.CurrentTvChannelResponse;
import com.goracz.lgwebosbackend.model.response.TvChannelListResponse;
import com.goracz.lgwebosbackend.service.CacheManager;
import com.goracz.lgwebosbackend.service.EventService;
import com.goracz.lgwebosbackend.service.TvControlService;
import com.goracz.lgwebosbackend.service.WebChannelMetadataService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
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
    private final CacheManager<String, TvChannelListResponse> channelListCacheManager;
    private final CacheManager<String, CurrentTvChannelResponse> currentChannelCacheManager;

    public TvControlServiceImpl(EventService<EventMessage<CurrentTvChannelResponse>> eventService, WebClient webClient,
            WebChannelMetadataService channelMetadataService,
            CacheManager<String, TvChannelListResponse> channelListCacheManager,
            CacheManager<String, CurrentTvChannelResponse> currentChannelCacheManager
    ) {
        this.eventService = eventService;
        this.webClient = webClient;
        this.channelMetadataService = channelMetadataService;
        this.channelListCacheManager = channelListCacheManager;
        this.currentChannelCacheManager = currentChannelCacheManager;
    }

    @Override
    public Mono<TvChannelListResponse> getChannelList() {
        return this.getChannelListFromCache()
                .switchIfEmpty(this.getChannelListFromTv())
                .flatMap(response -> this.channelMetadataService.populate(response.getChannelList())
                        .collectList()
                        .map(TvChannelListResponse::fromListOfChannels)
                        .flatMap(this::writeChannelListToCache));
    }

    private Mono<TvChannelListResponse> getChannelListFromCache() {
        return this.channelListCacheManager.read(TV_CHANNEL_LIST_CACHE_KEY);
    }

    private Mono<TvChannelListResponse> getChannelListFromTv() {
        return this.webClient
                .get()
                .uri("/tv/channels")
                .retrieve()
                .bodyToMono(TvChannelListResponse.class)
                .log();
    }

    private Mono<TvChannelListResponse> writeChannelListToCache(TvChannelListResponse populatedChannels) {
        return this.channelListCacheManager
                .write(TV_CHANNEL_LIST_CACHE_KEY, populatedChannels)
                .retry(CACHE_WRITE_TRIES)
                .thenReturn(populatedChannels);
    }

    @Override
    public Mono<CurrentTvChannelResponse> getCurrentChannel() {
        return this.getCurrentChannelFromCache()
                .switchIfEmpty(this.getCurrentChannelFromTv())
                .flatMap(this::writeCurrentChannelToCache);
    }

    private Mono<CurrentTvChannelResponse> getCurrentChannelFromCache() {
        return this.currentChannelCacheManager
                .read(TV_CHANNEL_CURRENT_KEY);
    }

    private Mono<CurrentTvChannelResponse> getCurrentChannelFromTv() {
        return this.webClient
                .get()
                .uri("/tv/channels/current")
                .retrieve()
                .bodyToMono(CurrentTvChannelResponse.class);
    }

    private Mono<CurrentTvChannelResponse> writeCurrentChannelToCache(CurrentTvChannelResponse currentChannel) {
        return this.currentChannelCacheManager
                .write(TV_CHANNEL_CURRENT_KEY, currentChannel)
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
            this.handleChannelChange(message)
                    .subscribeOn(Schedulers.boundedElastic())
                    .subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    private Mono<Void> handleChannelChange(ConsumerRecord<String, String> message) {
        return this.getCurrentTvChannelFromMqMessage(message)
                .flatMap(this::writeCurrentChannelToCache)
                .flatMap(this::notifyListenersAboutChannelChange);
    }

    private Mono<CurrentTvChannelResponse> getCurrentTvChannelFromMqMessage(
            ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> new ObjectMapper().readValue(message.value(), CurrentTvChannelResponse.class));
    }

    private Mono<Void> notifyListenersAboutChannelChange(CurrentTvChannelResponse currentChannel) {
        return Mono.fromCallable(() -> new EventMessage<>(EventCategory.CHANNEL_CHANGED, currentChannel))
                .map(eventMessage -> this.eventService.emit(eventMessage, eventMessage.getCategory()))
                .then()
                .publishOn(Schedulers.boundedElastic());
    }
}
