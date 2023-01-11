package com.goracz.controlservice.model;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Event categories that are categorizing the various emitted events and their messages
 * @implNote These event categories are included in the Server-Sent Event messages
 */
@JsonFormat(shape = JsonFormat.Shape.NUMBER)
public enum EventCategory {
    /**
     * The volume of the TV has changed
     */
    VOLUME_CHANGED,

    /**
     * The selected channel on the TV has changed
     */
    CHANNEL_CHANGED,

    /**
     * The power state of the TV has changed
     */
    POWER_STATE_CHANGED;
}
