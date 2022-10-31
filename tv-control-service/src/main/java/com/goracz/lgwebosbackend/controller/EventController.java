package com.goracz.lgwebosbackend.controller;

import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.goracz.lgwebosbackend.model.EventMessage;
import com.goracz.lgwebosbackend.service.EventService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService<EventMessage<?>> eventService;

    @GetMapping(value = "stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<EventMessage>> getEventStream() {
        return this.eventService
                .getEventStream()
                .asFlux()
                .cast(EventMessage.class)
                .map(event -> ServerSentEvent.builder(event).build());
    }

}
