package com.goracz.controlservice.model.response;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PowerStateResponse implements Serializable {
    @JsonProperty("returnValue")
    private boolean returnValue;
    @JsonProperty("subscribed")
    private boolean subscribed;
    @JsonProperty("reason")
    private String reason;
    @JsonProperty("onOff")
    private PowerMode powerMode;
    @JsonProperty("processing")
    private PowerStateProcessing processing;
    @JsonProperty("state")
    private PowerState state;
}

enum PowerStateProcessing {
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

enum PowerState {
    @JsonProperty("Active")
    ACTIVE,
    @JsonProperty("Active Standby")
    ACTIVE_STANDBY,
    @JsonProperty("Suspend")
    SUSPEND;
}

enum PowerMode {
    @JsonProperty("on")
    ON,
    @JsonProperty("off")
    OFF;
}
