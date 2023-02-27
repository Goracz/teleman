package com.goracz.controlservice.model.request;

import com.goracz.controlservice.model.WebOSApplication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class LaunchAppRequest {
    private WebOSApplication application;
}
