package com.goracz.controlservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A message emitted as a Server-Sent Event
 * @param <T> Type of the object of the message entity
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class EventMessage<T> {
    /**
     * Category of the event
     */
    private EventCategory category;

    /**
     * Payload of the event
     */
    private T payload;
}
