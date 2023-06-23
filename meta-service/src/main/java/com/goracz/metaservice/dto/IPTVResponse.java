package com.goracz.metaservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class IPTVResponse {
    @JsonProperty("tv")
    private Tv tv;

    public IPTVResponse() {
        this.tv = new Tv();
    }
}
