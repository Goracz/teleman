package com.goracz.statsservice.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class PowerStateResponse {
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

    public boolean hasTvTurnedOn() {
        return this.getState().equals(PowerState.ACTIVE) && this.isSubscribed();
    }

    public boolean hasTvTurnedOff() {
        return this.getState().equals(PowerState.SUSPEND);
    }
}
