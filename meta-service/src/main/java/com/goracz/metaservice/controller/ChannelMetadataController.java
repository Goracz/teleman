package com.goracz.metaservice.controller;

import com.goracz.metaservice.entity.ChannelMetadata;
import com.goracz.metaservice.model.request.ChannelMetadataSearchRequest;
import com.goracz.metaservice.service.ChannelMetadataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/channel-metadata")
@RequiredArgsConstructor
public class ChannelMetadataController {
    private final ChannelMetadataService channelMetadataService;

    @PostMapping("search")
    public ResponseEntity<Mono<ChannelMetadata>> getByChannelName(
            @RequestBody ChannelMetadataSearchRequest searchRequest) {
        return ResponseEntity.ok(this.channelMetadataService.getByChannelName(searchRequest.getChannelName()));
    }
}
