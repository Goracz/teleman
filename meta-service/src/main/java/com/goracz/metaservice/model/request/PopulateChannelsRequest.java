package com.goracz.metaservice.model.request;

import com.goracz.metaservice.model.Channel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PopulateChannelsRequest {
    private Collection<Channel> channels;
}
