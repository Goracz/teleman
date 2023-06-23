package com.goracz.metaservice.dto;


import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Icon {
    @JsonAlias("src")
    private String src;
}
