package com.goracz.controlservice.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.goracz.controlservice.model.Channel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedList;
import java.util.List;

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
    private List<Channel> channelList;
    private boolean subscribed;

    public static TvChannelListResponse fromListOfChannels(List<Channel> channels) {
        return TvChannelListResponse
                .builder()
                .channelList(new LinkedList<>(channels))
                .build();
    }
}
