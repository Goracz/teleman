package com.goracz.controlservice.service;

import com.goracz.controlservice.model.Channel;
import com.goracz.controlservice.model.response.ChannelMetadataResponse;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collection;

/**
 * Interface for getting meta-data about TV channels
 */
public interface WebChannelMetadataService {
    /**
     * Gets a given channel's meta-data by its name
     * @param channelName Name of the channel to get the meta-data of
     * @return Meta-data of the given channel
     */
    Mono<ChannelMetadataResponse> getChannelMetadataByChannelName(String channelName);

    /**
     * Sends a request to the channel meta-data service to pre-cache meta-data about given channels
     * @param channels Channels to pre-cache
     * @return Channels that have been pre-cached
     */
    Flux<Channel> populate(Collection<Channel> channels);
}
