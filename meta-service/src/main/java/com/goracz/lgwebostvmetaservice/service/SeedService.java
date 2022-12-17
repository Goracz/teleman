package com.goracz.lgwebostvmetaservice.service;

import reactor.core.publisher.Mono;

public interface SeedService {
    Mono<Void> seedChannelMetadata();
}
