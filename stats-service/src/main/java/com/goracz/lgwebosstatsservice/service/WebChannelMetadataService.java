package com.goracz.lgwebosstatsservice.service;

import com.goracz.lgwebosstatsservice.model.response.ChannelMetadataResponse;
import reactor.core.publisher.Mono;

public interface WebChannelMetadataService {
    Mono<ChannelMetadataResponse> getChannelMetadataByChannelName(String channelName);
}
