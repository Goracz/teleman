package com.goracz.controlservice.controller.media;

import com.goracz.controlservice.service.MediaControlService;
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(summary = "Get current volume")
    public ResponseEntity <Mono<GetVolumeResponse>> getVolume() {
        return ResponseEntity.ok(this.mediaControlService.getVolume());
    }

    @PostMapping("/up")
    @Operation(summary = "Increase volume by 1")
    public ResponseEntity<Mono<Void>> increaseVolume() {
        return ResponseEntity.ok(this.mediaControlService.increaseVolume());
    }

    @PostMapping("/down")
    @Operation(summary = "Decrease volume by 1")
    public ResponseEntity<Mono<Void>> decreaseVolume() {
        return ResponseEntity.ok(this.mediaControlService.decreaseVolume());
    }

    @PostMapping
    @Operation(summary = "Set volume to specified value")
    public ResponseEntity<Mono<Object>> setVolume(@RequestBody SetVolumeDto setVolumeDto) {
        return ResponseEntity.ok(this.mediaControlService.setVolume(setVolumeDto));
    }
}
