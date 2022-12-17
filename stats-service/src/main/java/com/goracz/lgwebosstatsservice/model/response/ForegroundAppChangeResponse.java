package com.goracz.lgwebosstatsservice.model.response;

import com.goracz.lgwebosstatsservice.model.WebOSApplication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ForegroundAppChangeResponse {
    private boolean subscribed;
    private boolean returnValue;
    private WebOSApplication appId;
    private String processId;
    private String windowId;
}
