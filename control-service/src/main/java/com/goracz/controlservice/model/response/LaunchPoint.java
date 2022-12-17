package com.goracz.controlservice.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class LaunchPoint {
    private String mediumLargeIcon;
    private String bgColor;
    private int installTime;
    private boolean systemApp;
    private String appDescription;
    private String launchPointId;
    private Collection<Object> bgImages;
    @JsonProperty("lptype")
    private String lpType;
    private boolean relaunch;
    private String favicon;
    private PreviewMetadata previewMetadata;
    private String icon;
    private boolean removable;
    private String bgImage;
    private String largeIcon;
    private String id;
    private String iconColor;
    private String tileSize;
    private String userData;
    private Params params;
    private boolean unmovable;
    private String extraLargeIcon;
    private String imageForRecents;
    @JsonProperty("miniicon")
    private String miniIcon;
    private String title;
}
