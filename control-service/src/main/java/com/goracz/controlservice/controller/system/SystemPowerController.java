package com.goracz.controlservice.controller.system;

import com.goracz.controlservice.model.response.PowerStateResponse;
import com.goracz.controlservice.service.SystemControlService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/system/power")
@RequiredArgsConstructor
public class SystemPowerController {
    private final SystemControlService systemControlService;

    @GetMapping
    @Operation(summary = "Get current power state")
    public ResponseEntity<Mono<PowerStateResponse>> getPowerState() {
        return ResponseEntity.ok(this.systemControlService.getPowerState());
    }

    @PostMapping("/off")
    @Operation(summary = "Turn off the TV")
    public ResponseEntity<Mono<Void>> turnOff() {
        return ResponseEntity.ok(this.systemControlService.turnOff());
    }

    @PostMapping("/on")
    @Operation(summary = "Turn on the TV")
    public ResponseEntity<Mono<Void>> turnOn() {
        return ResponseEntity.ok(this.systemControlService.turnOn());
    }
}
