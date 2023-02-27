package com.goracz.controlservice.model.request;

import com.goracz.controlservice.model.response.LgChannel;
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
    private Collection<LgChannel> channels;
}
