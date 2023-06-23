package com.goracz.metaservice.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TextLanguage {
    @JsonAlias("lang")
    private String language;
    @JsonAlias("text")
    private String text;
}
