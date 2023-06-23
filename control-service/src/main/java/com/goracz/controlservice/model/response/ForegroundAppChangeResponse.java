package com.goracz.controlservice.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.goracz.controlservice.model.WebOSApplication;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ForegroundAppChangeResponse {
    private boolean subscribed;
    private boolean returnValue;
    private WebOSApplication appId;
    private String processId;
    private String windowId;
}
