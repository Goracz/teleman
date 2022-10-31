package com.goracz.lgwebosstatsservice.model.response;

import com.goracz.lgwebosstatsservice.entity.ChannelCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ChannelMetadataResponse {
    private String id;
    private String channelName;
    private ChannelCategory channelCategory;
    private String channelLogoUrl;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
