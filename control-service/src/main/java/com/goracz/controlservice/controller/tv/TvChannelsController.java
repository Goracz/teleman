package com.goracz.controlservice.controller.tv;

import com.goracz.controlservice.model.response.CurrentTvChannelResponse;
import com.goracz.controlservice.service.TvControlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.goracz.controlservice.model.request.SetChannelRequest;
import com.goracz.controlservice.model.response.TvChannelListResponse;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/tv/channels")
@RequiredArgsConstructor
public class TvChannelsController {
    private final TvControlService tvControlService;

    @GetMapping
    public ResponseEntity<Mono<TvChannelListResponse>> getChannelList() {
        return ResponseEntity.ok(this.tvControlService.getChannelList());
    }

    @GetMapping("/current")
    public ResponseEntity<Mono<CurrentTvChannelResponse>> getCurrentChannel() {
        return ResponseEntity.ok(this.tvControlService.getCurrentChannel());
    }

    @PostMapping("/next")
    public ResponseEntity<Mono<Void>> goToNextChannel() {
        return ResponseEntity.ok(this.tvControlService.goToNextChannel());
    }

    @PostMapping("/previous")
    public ResponseEntity<Mono<Void>> goToPreviousChannel() {
        return ResponseEntity.ok(this.tvControlService.goToPreviousChannel());
    }

    @PostMapping
    public ResponseEntity<Mono<Void>> setChannel(@RequestBody SetChannelRequest setChannelRequest) {
        return ResponseEntity.ok(this.tvControlService.setChannel(setChannelRequest.getChannelId()));
    }
}
