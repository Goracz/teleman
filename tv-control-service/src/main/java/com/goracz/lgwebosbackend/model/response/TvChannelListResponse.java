package com.goracz.lgwebosbackend.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TvChannelListResponse {
    private boolean returnValue;
    private String ipChanInteractiveUrl;
    private String channelLogoServerUrl;
    private String valueList;
    private int channelListCount;
    private int dataSource;
    @JsonProperty("tuner_channel")
    private TunerChannel tunerChannel;
    private int dataType;
    @JsonProperty("channelList")
    private ArrayList<Channel> channelList;
    private boolean subscribed;
}
