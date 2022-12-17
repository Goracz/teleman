package com.goracz.statsservice.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

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
