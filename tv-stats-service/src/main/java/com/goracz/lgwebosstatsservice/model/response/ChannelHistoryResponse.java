package com.goracz.lgwebosstatsservice.model.response;

import com.goracz.lgwebosstatsservice.entity.ChannelHistory;
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
