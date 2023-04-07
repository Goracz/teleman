package com.goracz.metaservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IPTVResponse {
    private Collection<Channel> channels;
    private Collection<Program> programs;
}
