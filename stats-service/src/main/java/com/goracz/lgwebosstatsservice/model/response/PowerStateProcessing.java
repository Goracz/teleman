package com.goracz.lgwebosstatsservice.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum PowerStateProcessing {
    @JsonProperty("Request Suspend")
    REQUEST_SUSPEND,
    @JsonProperty("Prepare Suspend")
    PREPARE_SUSPEND,
    @JsonProperty("Request Active Standby")
    REQUEST_ACTIVE_STANDBY,
    @JsonProperty("Prepare Active Standby")
    PREPARE_ACTIVE_STANDBY,
    @JsonProperty("Screen On")
    SCREEN_ON,
    @JsonProperty("Request Screen Saver")
    REQUEST_SCREEN_SAVER,
    @JsonProperty("Request Power Off Logo")
    REQUEST_POWER_OFF_LOGO,
    @JsonProperty("Request Power Off")
    REQUEST_POWER_OFF,
    @JsonProperty("Prepare Power On")
    PREPARE_POWER_ON,
    @JsonProperty("LastInput Ready")
    LAST_INPUT_READY;
}
