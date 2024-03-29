package com.goracz.controlservice.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ScannedChannelCount {
    private int cableAnalogCount;
    private int terrestrialAnalogCount;
    private int terrestrialDigitalCount;
    private int satelliteDigitalCount;
    private int cableDigitalCount;
}
