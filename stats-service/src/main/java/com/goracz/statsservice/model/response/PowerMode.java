package com.goracz.statsservice.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum PowerMode {
    @JsonProperty("on")
    ON,
    @JsonProperty("off")
    OFF;
}
