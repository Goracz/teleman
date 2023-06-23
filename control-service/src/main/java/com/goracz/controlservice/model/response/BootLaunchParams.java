package com.goracz.controlservice.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BootLaunchParams {
    @JsonProperty("BGMode")
    private String bGMode;
    private boolean boot;
}
