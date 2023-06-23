package com.goracz.metaservice.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;

import java.util.LinkedList;
import java.util.List;

@Data
public class Tv {
    @JsonAlias("date")
    private String date;
    @JsonAlias("channel")
    private List<Channel> channels;
    @JsonAlias("programme")
    private List<Programme> programmes;

    public Tv() {
        channels = new LinkedList<>();
        programmes = new LinkedList<>();
    }
}
