package com.goracz.lgwebosbackend.controller.system;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.goracz.lgwebosbackend.model.response.PowerStateResponse;
import com.goracz.lgwebosbackend.service.SystemControlService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/system/power")
@RequiredArgsConstructor
public class SystemPowerController {

    private final SystemControlService systemControlService;

    @GetMapping
    public ResponseEntity<Mono<PowerStateResponse>> getPowerState() {
        return ResponseEntity.ok(this.systemControlService.getPowerState());
    }

    @PostMapping("/off")
    public ResponseEntity<Mono<Void>> turnOff() {
        return ResponseEntity.ok(this.systemControlService.turnOff());
    }

    @PostMapping("/on")
    public ResponseEntity<Mono<Void>> turnOn() {
        return ResponseEntity.ok(this.systemControlService.turnOn());
    }

}
