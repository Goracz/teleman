package com.goracz.lgwebosbackend.service.impl;

import org.springframework.stereotype.Service;

import com.goracz.lgwebosbackend.service.EventService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Sinks;

@Service
@RequiredArgsConstructor
public class EventServiceImpl<T> implements EventService<T> {

    @Getter
    private final Sinks.Many<T> eventStream = Sinks.many().multicast().onBackpressureBuffer();

}
