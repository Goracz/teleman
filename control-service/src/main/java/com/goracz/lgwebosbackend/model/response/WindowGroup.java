package com.goracz.lgwebosbackend.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class WindowGroup {
    private boolean owner;
    private String name;
    private ClientInfo clientInfo;
    private OwnerInfo ownerInfo;
}
