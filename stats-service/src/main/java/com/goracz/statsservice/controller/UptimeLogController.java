package com.goracz.statsservice.controller;

import com.goracz.statsservice.entity.UptimeLog;
import com.goracz.statsservice.service.UptimeService;

import io.swagger.v3.oas.annotations.Operation;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/uptime")
@RequiredArgsConstructor
public class UptimeLogController {
    private final UptimeService uptimeService;

    @GetMapping
    @Operation(summary = "Get the latest uptime log entry")
    public ResponseEntity<Mono<UptimeLog>> getLatestUptimeLog() {
        return ResponseEntity.ok(this.uptimeService.getLatestUptimeLog());
    }
}
