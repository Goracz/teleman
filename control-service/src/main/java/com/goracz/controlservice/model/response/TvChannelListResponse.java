package com.goracz.controlservice.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
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
    private ArrayList<LgChannel> channelList;
    private boolean subscribed;

    public static TvChannelListResponse fromListOfChannels(List<LgChannel> channels) {
        return TvChannelListResponse.builder().channelList(new ArrayList<>(channels)).build();
    }
}
