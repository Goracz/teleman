package com.goracz.automationservice.service.impl;

import com.goracz.automationservice.model.response.EventCategory;
import com.goracz.automationservice.model.response.EventMessage;
import com.goracz.automationservice.service.EventService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

@Service
@RequiredArgsConstructor
public class EventServiceImpl<T> implements EventService<T> {
    @Getter
    private final Sinks.Many<T> eventStream = Sinks.many().multicast().onBackpressureBuffer();
    @Override
    public Mono<Sinks.EmitResult> emit(T message, EventCategory eventCategory) {
        return Mono.fromCallable(() -> new EventMessage<>(eventCategory, message))
                .map(eventMessage -> this.getEventStream().tryEmitNext(message));
    }
}
