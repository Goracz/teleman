package com.goracz.lgwebosstatsservice.controller;

import com.goracz.lgwebosstatsservice.entity.ChannelHistory;
import com.goracz.lgwebosstatsservice.model.request.ChannelHistoryRequest;
import com.goracz.lgwebosstatsservice.service.ChannelHistoryService;
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
    public ResponseEntity<Flux<ChannelHistory>> getByTimeRange(
            @RequestBody ChannelHistoryRequest channelHistoryRequest) {
        return ResponseEntity.ok(this.channelHistoryService.getByTimeRange(channelHistoryRequest));
    }
}
