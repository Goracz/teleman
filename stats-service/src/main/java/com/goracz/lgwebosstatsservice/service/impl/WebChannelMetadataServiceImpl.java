package com.goracz.lgwebosstatsservice.service.impl;

import com.goracz.lgwebosstatsservice.model.request.ChannelMetadataSearchRequest;
import com.goracz.lgwebosstatsservice.model.response.ChannelMetadataResponse;
import com.goracz.lgwebosstatsservice.service.WebChannelMetadataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class WebChannelMetadataServiceImpl implements WebChannelMetadataService {

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
                .log();
    }
}
