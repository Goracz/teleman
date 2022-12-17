package com.goracz.lgwebosbackend.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VendorExtension {
    private boolean enableKeyboard;
    private boolean allowCrossDomain;
    private boolean enableMouse;
}
