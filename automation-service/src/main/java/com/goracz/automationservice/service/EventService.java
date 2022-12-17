package com.goracz.automationservice.service;

import com.goracz.automationservice.model.response.EventCategory;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

public interface EventService<T> {
    Sinks.Many<T> getEventStream();
    Mono<Sinks.EmitResult> emit(T message, EventCategory eventCategory);
}
