package com.goracz.controlservice.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import java.io.Serializable;

/**
 * Holds the possible WebOS applications that can be run in the foreground with their package names together.
 */
public enum WebOSApplication implements Serializable {
    @JsonProperty("com.webos.app.livetv")
    TV("com.webos.app.livetv"),
    @JsonProperty("com.webos.app.browser")
    BROWSER("com.webos.app.browser"),
    @JsonProperty("youtube.leanback.v4")
    YOUTUBE("youtube.leanback.v4"),
    @JsonProperty("spotify-beehive")
    SPOTIFY("spotify-beehive"),
    TWITCH("tv.twitch.tv.starshot.lg"),
    @JsonProperty("")
    BLANK("");

    private final String appPackageName;

    WebOSApplication(String appPackageName) {
        this.appPackageName = appPackageName;
    }

    @JsonValue
    public String getAppPackageName() {
        return appPackageName;
    }
}
