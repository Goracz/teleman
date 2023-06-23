package com.goracz.statsservice.model.response;

import com.goracz.statsservice.entity.ChannelHistory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChannelHistoryResponse {
    private Collection<ChannelHistory> channelHistories;
}
