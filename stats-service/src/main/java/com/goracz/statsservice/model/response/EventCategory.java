package com.goracz.statsservice.model.response;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.NUMBER)
public enum EventCategory {
    CHANNEL_HISTORY_CHANGED,
    FOREGROUND_APP_CHANGED,
    UPTIME_LOG_CHANGED,
    POWER_STATE_CHANGED,
    TEST
}
