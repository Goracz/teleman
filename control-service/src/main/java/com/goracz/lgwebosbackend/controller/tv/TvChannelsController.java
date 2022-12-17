package com.goracz.lgwebosbackend.controller.tv;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.goracz.lgwebosbackend.model.request.SetChannelRequest;
import com.goracz.lgwebosbackend.model.response.CurrentTvChannelResponse;
import com.goracz.lgwebosbackend.model.response.TvChannelListResponse;
import com.goracz.lgwebosbackend.service.TvControlService;

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
