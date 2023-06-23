package com.goracz.metaservice.dto;


import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Channel {
    @JsonAlias("id")
    private String id;
    @JsonAlias("displayName")
    private String displayName;
    @JsonAlias("url")
    private String url;
}
