package com.goracz.lgwebosbackend.service;

import com.goracz.lgwebosbackend.model.response.ChannelMetadataResponse;
import reactor.core.publisher.Mono;

public interface WebChannelMetadataService {
    Mono<ChannelMetadataResponse> getChannelMetadataByChannelName(String channelName);
}
