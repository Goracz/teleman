package com.goracz.statsservice.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChannelHistoryRequest {
    /**
     * Start of the time range
     */
    private LocalDate start;
    /**
     * End of the time range
     */
    private LocalDate end;
}
