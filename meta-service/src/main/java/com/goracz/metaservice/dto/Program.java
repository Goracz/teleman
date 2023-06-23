package com.goracz.metaservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Program {
    private String site;
    private String channel;
    private Collection<Title> titles;
    @JsonProperty("sub_titles")
    private Collection<Object> subTitles;
    private Collection<Description> descriptions;
    private Icon icon;
    private Collection<Object> episodeNumbers;
    private Object date;
    private Object start;
    private Object stop;
    private Collection<Object> urls;
    private Collection<Object> ratings;
    private Collection<Category> categories;
    private Collection<Object> directors;
    private Collection<Object> actors;
    private Collection<Object> writers;
    private Collection<Object> adapters;
    private Collection<Object> producers;
    private Collection<Object> composers;
    private Collection<Object> editors;
    private Collection<Object> presenters;
    private Collection<Object> commentators;
    private Collection<Object> guests;
}
