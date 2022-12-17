package com.goracz.metaservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.couchbase.core.mapping.Document;
import org.springframework.data.domain.Persistable;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;

@Document
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChannelMetadata implements Serializable, Persistable<String> {
    @Id
    private String id;
    /**
     * Name of the channel
     */
    private String channelName;
    /**
     * Alternate ISP names of the channel
     */
    private Collection<String> channelNameAliases = this.generateChannelNameAliases();
    /**
     * Category of the channel
     */
    private ChannelCategory channelCategory;
    /**
     * URI to the channel's logo
     */
    private String channelLogoUrl;
    @CreatedDate
    private ZonedDateTime createdAt;
    @LastModifiedDate
    private ZonedDateTime updatedAt;

    @Override
    @JsonIgnore
    public boolean isNew() {
        return false;
    }

    /**
     * Generates a list of potential channel name aliases
     * @return List of alternate channel names to the original channel name
     */
    private Collection<String> generateChannelNameAliases() {
        if (this.channelName == null) {
            return new ArrayList<>();
        }

        final Collection<String> result = new ArrayList<>();
        if (this.channelName.toLowerCase().contains("hd")) {
            result.add(this.channelName.replaceAll("(?i)HD", ""));
        } else {
            result.add(this.channelName + " HD");
        }
        if (this.channelName.toLowerCase().contains("sd")) {
            result.add(this.channelName.replaceAll("(?i)SD", ""));
        } else {
            result.add(this.channelName + " SD");
        }
        if (this.channelName.toLowerCase().contains("tv")) {
            result.add(this.channelName.replace("(?i)tv", ""));
        } else {
            result.add(this.channelName + " TV");
        }
        return result;
    }
}
