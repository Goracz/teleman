package com.goracz.lgwebostvmetaservice.controller;

import com.goracz.lgwebostvmetaservice.dto.IPTVResponse;
import com.goracz.lgwebostvmetaservice.entity.ChannelMetadata;
import com.goracz.lgwebostvmetaservice.model.request.ChannelMetadataSearchRequest;
import com.goracz.lgwebostvmetaservice.model.request.PopulateChannelsRequest;
import com.goracz.lgwebostvmetaservice.model.response.PopulateChannelsResponse;
import com.goracz.lgwebostvmetaservice.service.ChannelMetadataService;
import com.goracz.lgwebostvmetaservice.service.MetadataScraperService;
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
    public ResponseEntity<Mono<IPTVResponse>> getChannelMetadataByCountry() {
        return ResponseEntity.ok(this.metadataScraperService.scrape("hu")); // TODO: Remove hard-coded value
    }

    @PostMapping("search")
    public ResponseEntity<Mono<ChannelMetadata>> getByChannelName(
            @RequestBody ChannelMetadataSearchRequest searchRequest) {
        return ResponseEntity.ok(this.channelMetadataService.getByChannelName(searchRequest.getChannelName()));
    }

    @PostMapping("populate")
    public ResponseEntity<Mono<PopulateChannelsResponse>> populate(@RequestBody PopulateChannelsRequest populateChannelRequest) {
        return ResponseEntity.ok(this.channelMetadataService.populate(populateChannelRequest.getChannels()));
    }
}
