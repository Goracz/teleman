package com.goracz.lgwebosstatsservice.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class CurrentTvChannelResponse {
    private boolean subscribed;
    private String channelTypeName;
    private String channelNumber;
    private boolean isChannelChanged;
    private String channelName;
    private boolean isInteractiveRestrictionChannel;
    private boolean isSkipped;
    private boolean isReplaceChannel;
    private boolean isLocked;
    private boolean isHEVCChannel;
    private int channelModeId;
    private boolean isInvisible;
    private boolean isScrambled;
    private String signalChannelId;
    private int physicalNumber;
    private Object hybridtvType;
    private boolean isDescrambled;
    private String channelModeName;
    private String channelId;
    private Object favoriteGroup;
    private int channelTypeId;
    private boolean isFineTuned;
    private DualChannel dualChannel;
}

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
class DualChannel {
    private Object dualChannelTypeName;
    private Object dualChannelNumber;
    private Object dualChannelId;
    private int dualChannelTypeId;
}
