package com.goracz.metaservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TVResponse {
    private String date;
    @JsonProperty("channel")
    private Collection<Channel> channels;
    @JsonProperty("programme")
    private Collection<Program> programs;
}
