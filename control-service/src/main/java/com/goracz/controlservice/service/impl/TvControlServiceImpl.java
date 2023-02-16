package com.goracz.controlservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.controlservice.component.RedisCacheProvider;
import com.goracz.controlservice.exception.KafkaConsumeFailException;
import com.goracz.controlservice.model.EventMessage;
import com.goracz.controlservice.model.request.SetChannelRequest;
import com.goracz.controlservice.model.response.CurrentTvChannelResponse;
import com.goracz.controlservice.model.response.TvChannelListResponse;
import com.goracz.controlservice.service.EventService;
import com.goracz.controlservice.service.TvControlService;
import com.goracz.controlservice.service.WebChannelMetadataService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
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

    public TvControlServiceImpl(EventService<EventMessage<CurrentTvChannelResponse>> eventService,
            WebClient webClient,
            WebChannelMetadataService channelMetadataService,
            RedisCacheProvider cacheProvider,
            ObjectMapper objectMapper) {
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
                        .flatMap(this::writeChannelListToCache));
    }

    private Mono<TvChannelListResponse> getChannelListFromCache() {
        return this.cacheProvider.getTvChannelListResponseCache().get(TV_CHANNEL_LIST_CACHE_KEY);
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
        return this.cacheProvider.getTvChannelListResponseCache()
                .set(TV_CHANNEL_LIST_CACHE_KEY, populatedChannels)
                .map(response -> populatedChannels)
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

    private Mono<CurrentTvChannelResponse> writeCurrentChannelToCache(CurrentTvChannelResponse currentChannel) {
        return this.cacheProvider.getCurrentTvChannelCache()
                .set(TV_CHANNEL_CURRENT_KEY, currentChannel)
                .map(response -> currentChannel)
                .retry(CACHE_WRITE_TRIES)
                .publishOn(Schedulers.parallel());
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
            this.handleChannelChange(message).subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    private Mono<Sinks.EmitResult> handleChannelChange(ConsumerRecord<String, String> message) {
        return this.getCurrentTvChannelFromMqMessage(message)
                .flatMap(this::writeCurrentChannelToCache)
                .flatMap(this::notifyListenersAboutChannelChange);
    }

    private Mono<CurrentTvChannelResponse> getCurrentTvChannelFromMqMessage(
            ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> this.objectMapper.readValue(message.value(), CurrentTvChannelResponse.class));
    }

    private Mono<Sinks.EmitResult> notifyListenersAboutChannelChange(CurrentTvChannelResponse currentChannel) {
        return Mono.fromCallable(() -> EventMessage.fromCurrentChannel(currentChannel))
                .flatMap(eventMessage -> this.eventService.emit(eventMessage, eventMessage.getCategory()));
    }
}
