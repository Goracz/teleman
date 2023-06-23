package com.goracz.controlservice.service;

import com.goracz.controlservice.model.response.ServiceDescription;

import reactor.core.publisher.Mono;

public interface MetaService {
    /**
     * Provides meta-data about this microservice.
     * @return Object that contains various meta-data about the current microservice.
     */
    Mono<ServiceDescription> describeService();
}
