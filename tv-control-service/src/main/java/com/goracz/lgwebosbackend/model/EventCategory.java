package com.goracz.lgwebosbackend.model;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.NUMBER)
public enum EventCategory {
    VOLUME_CHANGED,
    CHANNEL_CHANGED,
    POWER_STATE_CHANGED;
}
