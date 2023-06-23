package com.goracz.statsservice.service;

import com.goracz.statsservice.model.response.ChannelMetadataResponse;

import reactor.core.publisher.Mono;

public interface WebChannelMetadataService {
    Mono<ChannelMetadataResponse> getChannelMetadataByChannelName(String channelName);
}
