package com.goracz.lgwebosstatsservice.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public enum WebOSApplication implements Serializable {
    @JsonProperty("com.webos.app.livetv")
    TV("com.webos.app.livetv"),
    YOUTUBE(""),
    TWITCH(""),
    @JsonProperty
    BLANK("");

    public final String appPackageName;

    WebOSApplication(String appPackageName) {
        this.appPackageName = appPackageName;
    }
}
