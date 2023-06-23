package com.goracz.statsservice.model.response;

import com.goracz.statsservice.entity.ChannelHistory;
import com.goracz.statsservice.entity.UptimeLog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class EventMessage<T> {
    private EventCategory category;
    private T payload;

    public static EventMessage<PowerStateResponse> fromPowerStateResponse(
            PowerStateResponse powerStateResponse) {
        return EventMessage.<PowerStateResponse>builder()
                .category(EventCategory.POWER_STATE_CHANGED)
                .payload(powerStateResponse)
                .build();
    }

    public static EventMessage<UptimeLog> fromUptimeLog(UptimeLog uptimeLog) {
        return EventMessage.<UptimeLog>builder()
                .category(EventCategory.UPTIME_LOG_CHANGED)
                .payload(uptimeLog)
                .build();
    }

    public static EventMessage<ChannelHistory> fromChannelHistoryChange(
            ChannelHistory channelHistory) {
        return EventMessage.<ChannelHistory>builder()
                .category(EventCategory.CHANNEL_HISTORY_CHANGED)
                .payload(channelHistory)
                .build();
    }

    public static EventMessage<ForegroundAppChangeResponse> fromForegroundAppChange(
            ForegroundAppChangeResponse foregroundApp) {
        return EventMessage.<ForegroundAppChangeResponse>builder()
                .category(EventCategory.FOREGROUND_APP_CHANGED)
                .payload(foregroundApp)
                .build();
    }
}
