package com.goracz.controlservice.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PreviewMetadata {
    public String targetEndpoint;
    public String sourceEndpoint;
}
