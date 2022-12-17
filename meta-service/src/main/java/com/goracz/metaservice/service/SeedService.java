package com.goracz.metaservice.service;

import reactor.core.publisher.Mono;

public interface SeedService {
    Mono<Void> seedChannelMetadata();
}
