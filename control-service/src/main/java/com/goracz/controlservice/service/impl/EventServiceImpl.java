package com.goracz.controlservice.service.impl;

import com.goracz.controlservice.service.EventService;
import com.goracz.controlservice.model.EventCategory;
import com.goracz.controlservice.model.EventMessage;
import org.springframework.stereotype.Service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

@Service
@RequiredArgsConstructor
public class EventServiceImpl<T> implements EventService<T> {
    @Getter
    private final Sinks.Many<T> eventStream = Sinks.many().multicast().directBestEffort();
    @Override
    public Mono<Sinks.EmitResult> emit(T message, EventCategory eventCategory) {
        return Mono.fromCallable(() -> new EventMessage<>(eventCategory, message))
                .map(eventMessage -> this.getEventStream().tryEmitNext(message));
    }
}
