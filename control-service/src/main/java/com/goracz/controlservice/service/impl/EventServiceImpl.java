package com.goracz.controlservice.service.impl;

import com.goracz.controlservice.model.EventCategory;
import com.goracz.controlservice.model.EventMessage;
import com.goracz.controlservice.service.EventService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class EventServiceImpl<T> implements EventService<T> {
    @Getter
    private final Sinks.Many<T> eventStream = Sinks.many().multicast().directAllOrNothing();
    @Override
    public Mono<Sinks.EmitResult> emit(final T message, final EventCategory eventCategory) {
        return Mono.fromCallable(() -> new EventMessage<>(eventCategory, message))
                .map(eventMessage -> this.getEventStream().tryEmitNext(message))
                .publishOn(Schedulers.immediate());
    }
}
