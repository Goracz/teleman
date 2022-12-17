package com.goracz.lgwebosbackend.service;

import com.goracz.lgwebosbackend.model.response.CurrentTvChannelResponse;
import com.goracz.lgwebosbackend.model.response.TvChannelListResponse;
import reactor.core.publisher.Mono;

/**
 * Interface for interacting with the TV's channels
 */
public interface TvControlService {
    /**
     * Gets the list of channels
     * @return List of the channels broadcast by the ISP
     */
    Mono<TvChannelListResponse> getChannelList();

    /**
     * Gets the currently running channel
     * @return Meta-data of the currently running channel
     */
    Mono<CurrentTvChannelResponse> getCurrentChannel();

    /**
     * Goes to the next channel
     */
    Mono<Void> goToNextChannel();

    /**
     * Goes to the previous channel
     */
    Mono<Void> goToPreviousChannel();

    /**
     * Goes to a given channel by its ID
     * @param channelId ID of the channel to go to
     */
    Mono<Void> setChannel(String channelId);
}
