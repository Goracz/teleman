package com.goracz.controlservice.service;

import com.goracz.controlservice.model.EventCategory;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

/**
 * Interface for emitting events by Server-Sent Events
 * @param <T> Type of the message to be emitted
 */
public interface EventService<T> {
    /**
     * Gets the event stream
     * @return Event stream that can be emitted on
     */
    Sinks.Many<T> getEventStream();

    Mono<Sinks.EmitResult> emit(T message, EventCategory eventCategory);
}
