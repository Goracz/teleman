package com.goracz.metaservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Program {
    private String channel;
    private String start;
    private String stop;
    private ProgramDetail title;
    @JsonProperty("desc")
    private ProgramDetail description;
}
