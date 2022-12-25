package com.goracz.metaservice.service;

import com.goracz.metaservice.entity.ChannelMetadata;
import com.goracz.metaservice.model.Channel;
import com.goracz.metaservice.model.response.PopulateChannelsResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collection;

public interface ChannelMetadataService {
    Mono<ChannelMetadata> add(ChannelMetadata channelMetadata);
    Flux<ChannelMetadata> getAll();
    Mono<ChannelMetadata> getById(String id);
    Mono<ChannelMetadata> getByChannelName(String channelName);
    Mono<ChannelMetadata> delete(ChannelMetadata channelMetadata);
    Mono<ChannelMetadata> deleteById(String id);
    Mono<ChannelMetadata> deleteByChannelName(String channelName);
    Mono<PopulateChannelsResponse> populate(Collection<Channel> channels);
}
