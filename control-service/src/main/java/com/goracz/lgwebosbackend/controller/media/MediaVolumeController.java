package com.goracz.lgwebosbackend.controller.media;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.goracz.lgwebosbackend.dto.media.volume.SetVolumeDto;
import com.goracz.lgwebosbackend.model.response.GetVolumeResponse;
import com.goracz.lgwebosbackend.service.MediaControlService;

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

    @PostMapping
    public ResponseEntity<Mono<Object>> setVolume(@RequestBody SetVolumeDto setVolumeDto) {
        return ResponseEntity.ok(this.mediaControlService.setVolume(setVolumeDto));
    }

}
