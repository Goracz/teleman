package com.goracz.statsservice.service;

import com.goracz.statsservice.model.response.EventMessage;

import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

public interface EventService<T extends EventMessage<?>> {
    Sinks.Many<T> getEventStream();
    Mono<Sinks.EmitResult> emit(T message);
}
