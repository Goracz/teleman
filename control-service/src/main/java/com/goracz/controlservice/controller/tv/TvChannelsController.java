package com.goracz.controlservice.controller.tv;

import com.goracz.controlservice.model.request.SetChannelRequest;
import com.goracz.controlservice.model.response.CurrentTvChannelResponse;
import com.goracz.controlservice.model.response.TvChannelListResponse;
import com.goracz.controlservice.service.TvControlService;

import io.swagger.v3.oas.annotations.Operation;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/tv/channels")
@RequiredArgsConstructor
public class TvChannelsController {
    private final TvControlService tvControlService;

    @GetMapping
    @Operation(summary = "Get list of available channels")
    public ResponseEntity<Mono<TvChannelListResponse>> getChannelList() {
        return ResponseEntity.ok(this.tvControlService.getChannelList());
    }

    @GetMapping("/current")
    @Operation(summary = "Get current channel")
    public ResponseEntity<Mono<CurrentTvChannelResponse>> getCurrentChannel() {
        return ResponseEntity.ok(this.tvControlService.getCurrentChannel());
    }

    @PostMapping("/next")
    @Operation(summary = "Switch to next channel")
    public ResponseEntity<Mono<Void>> goToNextChannel() {
        return ResponseEntity.ok(this.tvControlService.goToNextChannel());
    }

    @PostMapping("/previous")
    @Operation(summary = "Switch to previous channel")
    public ResponseEntity<Mono<Void>> goToPreviousChannel() {
        return ResponseEntity.ok(this.tvControlService.goToPreviousChannel());
    }

    @PostMapping
    @Operation(summary = "Switch to specific channel")
    public ResponseEntity<Mono<Void>> setChannel(@RequestBody SetChannelRequest setChannelRequest) {
        return ResponseEntity.ok(this.tvControlService.setChannel(setChannelRequest.getChannelId()));
    }
}
