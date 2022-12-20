package com.goracz.statsservice.service.impl;

import com.goracz.statsservice.service.EventService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Sinks;

@Service
@RequiredArgsConstructor
public class EventServiceImpl<T> implements EventService<T> {
    @Getter
    private final Sinks.Many<T> eventStream = Sinks.many().multicast().directBestEffort();
}