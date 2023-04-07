package com.goracz.controlservice.service.impl;

import com.goracz.controlservice.model.request.ChannelMetadataSearchRequest;
import com.goracz.controlservice.model.request.PopulateChannelsRequest;
import com.goracz.controlservice.model.response.ChannelMetadataResponse;
import com.goracz.controlservice.model.response.LgChannel;
import com.goracz.controlservice.model.response.PopulateChannelsResponse;
import com.goracz.controlservice.service.WebChannelMetadataService;
import com.goracz.controlservice.service.WebService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;import reactor.core.scheduler.Schedulers;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class WebChannelMetadataServiceImpl extends WebService implements WebChannelMetadataService {
    private final WebClient webClient;
    @Value("${metaService.uri}")
    private String metaServiceUri;

    @Override
    public Mono<ChannelMetadataResponse> getChannelMetadataByChannelName(String channelName) {
        return this.webClient
                .post()
                .uri(String.format("%s/api/v1/channel-metadata/search", metaServiceUri), channelName)
                .body(Mono.just(ChannelMetadataSearchRequest.builder().channelName(channelName).build()),
                        ChannelMetadataSearchRequest.class)
                .retrieve()
                .bodyToMono(ChannelMetadataResponse.class)
                .retry(this.retriesCount)
                .log()
                .publishOn(Schedulers.boundedElastic());
    }

    @Override
    public Flux<LgChannel> populate(Collection<LgChannel> channels) {
        return this.webClient
                .post()
                .uri(String.format("%s/api/v1/channel-metadata/populate", metaServiceUri))
                .bodyValue(PopulateChannelsRequest.builder().channels(channels).build())
                .retrieve()
                .bodyToFlux(PopulateChannelsResponse.class)
                .retry(this.retriesCount)
                .flatMap(PopulateChannelsResponse::getChannels)
                .log()
                .publishOn(Schedulers.boundedElastic());
    }
}
