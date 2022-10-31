package com.goracz.lgwebosbackend.service;

import com.goracz.lgwebosbackend.model.response.CurrentTvChannelResponse;
import com.goracz.lgwebosbackend.model.response.TvChannelListResponse;
import reactor.core.publisher.Mono;

public interface TvControlService {
    Mono<TvChannelListResponse> getChannelList();

    Mono<CurrentTvChannelResponse> getCurrentChannel();

    Mono<Void> setChannel(String channelId);
}
