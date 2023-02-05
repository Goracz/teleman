package com.goracz.statsservice.entity;

import com.goracz.statsservice.model.WebOSApplication;
import com.goracz.statsservice.model.response.ChannelMetadataResponse;
import com.goracz.statsservice.model.response.CurrentTvChannelResponse;
import com.goracz.statsservice.model.response.ForegroundAppChangeResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.mongodb.core.mapping.Document;
import reactor.core.publisher.Mono;

import java.io.Serializable;
import java.time.ZonedDateTime;

@Document
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChannelHistory implements Serializable, Persistable<String> {
    /**
     * Primary key
     */
    @Id
    private String id;

    /**
     * ID of the channel
     */
    private String channelId;

    /**
     * Name of the channel
     */
    private String channelName;

    /**
     * Category of the channel
     */
    private ChannelCategory channelCategory;

    /**
     * Application that was running on the TV
     */
    private WebOSApplication application;

    /**
     * URI to the channel's logo
     */
    private String channelLogoUrl;

    /**
     * Date time when the channel was started to be watched
     */
    private ZonedDateTime start;

    /**
     * Date time when the channel was stopped to be watched
     */
    private ZonedDateTime end;

    public static Mono<ChannelHistory> empty() {
        return Mono.just(ChannelHistory.builder().build());
    }

    public static ChannelHistory fromChannelHistory(ChannelHistory channelHistory) {
        return ChannelHistory
                .builder()
                .channelId(channelHistory.getChannelId())
                .channelName(channelHistory.getChannelName())
                .channelCategory(channelHistory.getChannelCategory())
                .channelLogoUrl(channelHistory.getChannelLogoUrl())
                .start(ZonedDateTime.now())
                .build();
    }

    public static ChannelHistory fromChannelHistoryAndMetadata(ChannelHistory channelHistory,
                                                               ChannelMetadataResponse metadata) {
        return ChannelHistory
                .builder()
                .channelId(channelHistory.getChannelId())
                .channelName(channelHistory.getChannelName())
                .channelCategory(metadata.getChannelCategory())
                .start(ZonedDateTime.now())
                .build();
    }

    public static ChannelHistory fromCurrentChannelAndMetadata(CurrentTvChannelResponse channelHistory,
                                                               ChannelMetadataResponse metadata) {
        return ChannelHistory
                .builder()
                .channelId(channelHistory.getChannelId())
                .channelName(channelHistory.getChannelName())
                .channelCategory(metadata.getChannelCategory())
                .start(ZonedDateTime.now())
                .build();
    }

    public static Mono<ChannelHistory> fromForegroundApplication(ForegroundAppChangeResponse foregroundAppChangeResponse) {
        return Mono.fromCallable(() -> ChannelHistory
                .builder()
                .application(foregroundAppChangeResponse.getAppId())
                .start(ZonedDateTime.now())
                .build());
    }

    public static ChannelHistory withMetadata(ChannelHistory channelHistory, ChannelMetadataResponse metadata) {
        channelHistory.setChannelLogoUrl(metadata.getChannelLogoUrl());
        return channelHistory;
    }

    @Override
    public boolean isNew() {
        return this.getStart() != null && this.getEnd() == null;
    }

    public ChannelHistory endViewNow() {
        this.setEnd(ZonedDateTime.now());
        return this;
    }
}
