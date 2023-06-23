package com.goracz.metaservice.dto;


import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Programme {
    @JsonAlias("start")
    private String start;
    @JsonAlias("stop")
    private String stop;
    @JsonAlias("channel")
    private String channel;
    @JsonAlias("title")
    private TextLanguage title;
    @JsonAlias("desc")
    private TextLanguage description;
    @JsonAlias("category")
    private TextLanguage category;
    @JsonAlias("icon")
    private Icon icon;
}
