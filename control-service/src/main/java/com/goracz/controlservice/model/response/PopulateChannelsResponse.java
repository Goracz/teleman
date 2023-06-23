package com.goracz.controlservice.model.response;

import com.goracz.controlservice.model.Channel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PopulateChannelsResponse {
    private Collection<Channel> channels;
}
