package com.goracz.controlservice.service.impl;

import com.goracz.controlservice.component.RedisCacheProvider;
import com.goracz.controlservice.model.response.ComponentKind;
import com.goracz.controlservice.model.response.ServiceDescription;
import com.goracz.controlservice.service.MetaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class MetaServiceImpl implements MetaService {
    private static final String CACHE_KEY = "meta:description";
    private final RedisCacheProvider cacheProvider;

    @Override
    public Mono<ServiceDescription> describeService() {
        return this.readFromCache()
                .switchIfEmpty(this.buildDescription())
                .flatMap(this::writeToCache);
    }

    private Mono<ServiceDescription> readFromCache() {
        return this.cacheProvider
                .getServiceDescriptionCache()
                .get(CACHE_KEY)
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<ServiceDescription> buildDescription() {
        return Mono.just(ServiceDescription.builder()
                .name("control-service")
                .version("0.0.1")
                .kind(ComponentKind.CORE)
                .layer(2)
                .build());
    }

    private Mono<ServiceDescription> writeToCache(ServiceDescription serviceDescription) {
        return this.cacheProvider
                .getServiceDescriptionCache()
                .set(CACHE_KEY, serviceDescription)
                .map(result -> serviceDescription)
                .publishOn(Schedulers.boundedElastic());
    }
}
