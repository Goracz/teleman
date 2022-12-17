package com.goracz.statsservice.service.impl;

import com.goracz.statsservice.model.request.ChannelMetadataSearchRequest;
import com.goracz.statsservice.model.response.ChannelMetadataResponse;
import com.goracz.statsservice.service.WebChannelMetadataService;
import com.goracz.statsservice.service.WebService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

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
}
