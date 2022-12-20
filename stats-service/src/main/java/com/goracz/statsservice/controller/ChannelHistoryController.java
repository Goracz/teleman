package com.goracz.statsservice.controller;

import com.goracz.statsservice.entity.ChannelHistory;
import com.goracz.statsservice.model.request.ChannelHistoryRequest;
import com.goracz.statsservice.service.ChannelHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/v1/channel-history")
@RequiredArgsConstructor
public class ChannelHistoryController {
    private final ChannelHistoryService channelHistoryService;

    @PostMapping("search")
    @Operation(summary = "Search for channel histories in a date time range")
    public ResponseEntity<Flux<ChannelHistory>> getByTimeRange(
            @RequestBody ChannelHistoryRequest channelHistoryRequest) {
        return ResponseEntity.ok(this.channelHistoryService.getByTimeRange(channelHistoryRequest));
    }
}
