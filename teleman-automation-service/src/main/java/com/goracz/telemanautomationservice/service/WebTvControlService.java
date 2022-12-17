package com.goracz.telemanautomationservice.service;

import reactor.core.publisher.Mono;

public interface WebTvControlService {
    Mono<Void> turnOnTv();
    Mono<Void> turnOffTv();
    Mono<Void> setChannel(String channelId);
    Mono<Void> setVolume(int value);
    Mono<Void> openApplication(String applicationId);
}
