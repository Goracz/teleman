package com.goracz.lgwebostvmetaservice.model.request;

import com.goracz.lgwebostvmetaservice.model.Channel;
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
