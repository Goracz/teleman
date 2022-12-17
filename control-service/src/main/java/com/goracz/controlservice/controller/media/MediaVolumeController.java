package com.goracz.controlservice.controller.media;

import com.goracz.controlservice.service.MediaControlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.goracz.controlservice.dto.media.volume.SetVolumeDto;
import com.goracz.controlservice.model.response.GetVolumeResponse;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/media/volume")
@RequiredArgsConstructor
public class MediaVolumeController {
    private final MediaControlService mediaControlService;

    @GetMapping
    public ResponseEntity<Mono<GetVolumeResponse>> getVolume() {
        return ResponseEntity.ok(this.mediaControlService.getVolume());
    }

    @PostMapping("/up")
    public ResponseEntity<Mono<Void>> increaseVolume() {
        return ResponseEntity.ok(this.mediaControlService.increaseVolume());
    }

    @PostMapping("/down")
    public ResponseEntity<Mono<Void>> decreaseVolume() {
        return ResponseEntity.ok(this.mediaControlService.decreaseVolume());
    }

    @PostMapping
    public ResponseEntity<Mono<Object>> setVolume(@RequestBody SetVolumeDto setVolumeDto) {
        return ResponseEntity.ok(this.mediaControlService.setVolume(setVolumeDto));
    }
}
