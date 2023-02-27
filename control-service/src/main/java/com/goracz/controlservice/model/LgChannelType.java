package com.goracz.controlservice.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum LgChannelType {
    TV("Cable Digital TV"),
    RADIO("Cable Digital Radio"),
    UNKNOWN("Unknown");

    private final String value;

    LgChannelType(String value) {
        this.value = value;
    }

    @JsonCreator
    public static LgChannelType fromValue(String value) {
        for (final LgChannelType channelType : LgChannelType.values()) {
            if (channelType.value.equalsIgnoreCase(value)) {
                return channelType;
            }
        }
        return UNKNOWN;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
