package com.goracz.metaservice.controller;

import com.goracz.metaservice.dto.IPTVResponse;
import com.goracz.metaservice.entity.ChannelMetadata;
import com.goracz.metaservice.model.request.ChannelMetadataSearchRequest;
import com.goracz.metaservice.model.request.PopulateChannelsRequest;
import com.goracz.metaservice.model.response.PopulateChannelsResponse;
import com.goracz.metaservice.service.ChannelMetadataService;
import com.goracz.metaservice.service.MetadataScraperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/channel-metadata")
@RequiredArgsConstructor
public class ChannelMetadataController {
    private final ChannelMetadataService channelMetadataService;
    private final MetadataScraperService metadataScraperService;

    @GetMapping()
    public ResponseEntity<Mono<IPTVResponse>> getChannelMetadataByCountry(@RequestParam String countryCode) {
        return ResponseEntity.ok(this.metadataScraperService.scrape(countryCode));
    }

    @PostMapping("search")
    public ResponseEntity<Mono<ChannelMetadata>> getByChannelName(
            @RequestBody ChannelMetadataSearchRequest searchRequest) {
        return ResponseEntity.ok(this.channelMetadataService.getByChannelName(searchRequest.getChannelName()));
    }

    @PostMapping("populate")
    public ResponseEntity<Mono<PopulateChannelsResponse>> populate(
            @RequestBody PopulateChannelsRequest populateChannelRequest) {
        return ResponseEntity.ok(this.channelMetadataService.populate(populateChannelRequest.getChannels()));
    }
}
