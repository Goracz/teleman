package com.goracz.statsservice.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum PowerState {
    @JsonProperty("Active")
    ACTIVE,
    @JsonProperty("Active Standby")
    ACTIVE_STANDBY,
    @JsonProperty("Suspend")
    SUSPEND,
    @JsonProperty("Screen Saver")
    SCREEN_SAVER
}
