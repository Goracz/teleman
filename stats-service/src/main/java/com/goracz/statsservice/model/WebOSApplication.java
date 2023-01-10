package com.goracz.statsservice.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

/**
 * Holds the possible WebOS applications that can be run in the foreground with their package names together.
 */
public enum WebOSApplication implements Serializable {
    @JsonProperty("com.webos.app.livetv")
    TV("com.webos.app.livetv"),
    @JsonProperty("com.webos.app.browser")
    BROWSER("com.webos.app.browser"),
    YOUTUBE(""),
    TWITCH(""),
    @JsonProperty
    BLANK("");

    public final String appPackageName;

    WebOSApplication(String appPackageName) {
        this.appPackageName = appPackageName;
    }
}
