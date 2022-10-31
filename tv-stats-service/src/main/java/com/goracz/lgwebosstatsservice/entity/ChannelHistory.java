package com.goracz.lgwebosstatsservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDate;
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

    @Override
    public boolean isNew() {
        return start != null && end == null;
    }
}
