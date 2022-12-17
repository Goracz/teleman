package com.goracz.lgwebosbackend.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ApplicationListResponse {
    private boolean subscribed;
    private boolean returnValue;
    private Collection<App> apps;
}
