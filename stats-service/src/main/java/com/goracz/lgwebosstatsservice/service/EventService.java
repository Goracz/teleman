package com.goracz.lgwebosstatsservice.service;

import reactor.core.publisher.Sinks;

public interface EventService<T> {
    Sinks.Many<T> getEventStream();
}
