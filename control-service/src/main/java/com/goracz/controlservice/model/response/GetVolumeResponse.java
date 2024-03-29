package com.goracz.controlservice.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class GetVolumeResponse {
    private boolean returnValue;
    private VolumeStatus volumeStatus;
    private String callerId;
}

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
class VolumeStatus {
    private boolean volumeLimitable;
    private boolean activeStatus;
    private int maxVolume;
    private String volumeLimiter;
    private String soundOutput;
    private String mode;
    private boolean externalDeviceControl;
    private int volume;
    private boolean volumeSyncable;
    private boolean adjustVolume;
    private boolean muteStatus;
    private String cause;
}
