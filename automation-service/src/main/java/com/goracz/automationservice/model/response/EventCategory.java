package com.goracz.automationservice.model.response;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.NUMBER)
public enum EventCategory {
    AUTOMATION_RULE_ADDED,
    AUTOMATION_RULE_MODIFIED,
    AUTOMATION_RULE_REMOVED;
}
