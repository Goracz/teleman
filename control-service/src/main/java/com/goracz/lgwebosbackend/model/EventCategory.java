package com.goracz.lgwebosbackend.model;

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
    POWER_STATE_CHANGED,

    /**
     * The channel history has changed
     * @implNote Usually happens when the channel that was being played has been changed
     * (f.e. because the TV power state has changed stand-by and no channel is being played from now on)
     */
    CHANNEL_HISTORY_CHANGED,

    /**
     * The application that has been in the foreground has changed
     */
    FOREGROUND_APP_CHANGED;
}
