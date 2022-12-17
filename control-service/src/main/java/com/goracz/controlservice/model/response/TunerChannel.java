package com.goracz.controlservice.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TunerChannel {
    private ScannedChannelCount scannedChannelCount;
    private int deviceSourceIndex;
    private boolean returnValue;
    private boolean cableAnalogSkipped;
    private int channelListCount;
    private int dataType;
    private String valueList;
}
