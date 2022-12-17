package com.goracz.metaservice.service;

import com.goracz.metaservice.entity.ChannelMetadata;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ChannelMetadataService {
    Mono<ChannelMetadata> add(ChannelMetadata channelMetadata);
    Flux<ChannelMetadata> getAll();
    Mono<ChannelMetadata> getById(String id);
    Mono<ChannelMetadata> getByChannelName(String channelName);
    Mono<Void> delete(ChannelMetadata channelMetadata);
    Mono<Void> deleteById(String id);
    Mono<Void> deleteByChannelName(String channelName);
}
