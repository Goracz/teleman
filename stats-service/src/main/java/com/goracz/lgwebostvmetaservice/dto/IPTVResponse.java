package com.goracz.lgwebostvmetaservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Collection;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IPTVResponse implements Serializable {
    private Collection<Channel> channels;
    private Collection<Program> programs;
}

