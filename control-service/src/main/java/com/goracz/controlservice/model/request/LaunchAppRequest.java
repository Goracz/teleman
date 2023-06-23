package com.goracz.controlservice.model.request;



import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class LaunchAppRequest {
    @JsonProperty("id")
    private String applicationId;
}
