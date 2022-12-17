package com.goracz.controlservice.service.impl;

import com.goracz.controlservice.model.response.Channel;
import com.goracz.controlservice.model.response.ChannelMetadataResponse;
import com.goracz.controlservice.model.response.PopulateChannelsResponse;
import com.goracz.controlservice.service.WebChannelMetadataService;
import com.goracz.controlservice.service.WebService;
import com.goracz.controlservice.model.request.ChannelMetadataSearchRequest;
import com.goracz.controlservice.model.request.PopulateChannelsRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class WebChannelMetadataServiceImpl extends WebService implements WebChannelMetadataService {
    private final WebClient webClient;

    @Override
    public Mono<ChannelMetadataResponse> getChannelMetadataByChannelName(String channelName) {
        return this.webClient
                .post()
                .uri("http://localhost:8082/api/v1/channel-metadata/search", channelName)
                .body(Mono.just(ChannelMetadataSearchRequest.builder().channelName(channelName).build()),
                        ChannelMetadataSearchRequest.class)
                .retrieve()
                .bodyToMono(ChannelMetadataResponse.class)
                .retry(this.retriesCount)
                .log();
    }

    @Override
    public Flux<Channel> populate(Collection<Channel> channels) {
        return this.webClient
                .post()
                .uri("http://localhost:8082/api/v1/channel-metadata/populate")
                .bodyValue(PopulateChannelsRequest.builder().channels(channels).build())
                .retrieve()
                .bodyToFlux(PopulateChannelsResponse.class)
                .retry(this.retriesCount)
                .flatMapIterable(PopulateChannelsResponse::getChannels)
                .log();
    }
}
