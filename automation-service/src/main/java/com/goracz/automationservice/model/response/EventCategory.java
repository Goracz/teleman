package com.goracz.automationservice.model.response;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.NUMBER)
public enum EventCategory {
    VOLUME_CHANGED,
    CHANNEL_CHANGED,
    POWER_STATE_CHANGED,
    CHANNEL_HISTORY_CHANGED,
    FOREGROUND_APP_CHANGED,
    AUTOMATION_RULE_ADDED,
    AUTOMATION_RULE_MODIFIED,
    AUTOMATION_RULE_REMOVED;
}
