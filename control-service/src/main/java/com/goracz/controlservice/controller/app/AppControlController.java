package com.goracz.controlservice.controller.app;

import com.goracz.controlservice.model.request.LaunchAppRequest;
import com.goracz.controlservice.model.response.ApplicationListResponse;
import com.goracz.controlservice.model.response.ForegroundAppChangeResponse;
import com.goracz.controlservice.model.response.LaunchPointsResponse;
import com.goracz.controlservice.service.AppControlService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/app")
@RequiredArgsConstructor
public class AppControlController {
    private final AppControlService appControlService;

    @GetMapping
    public ResponseEntity<Mono<ApplicationListResponse>> getApplications() {
        return ResponseEntity.ok(this.appControlService.getApplications());
    }
    @PostMapping("launch")
    public ResponseEntity<Mono<Void>> launchApp(@RequestBody LaunchAppRequest launchAppRequest) {
        return ResponseEntity.ok(this.appControlService.launchApp(launchAppRequest.getApplicationId()));
    }

    @GetMapping("foreground")
    public ResponseEntity<Mono<ForegroundAppChangeResponse>> getForegroundApplication() {
        return ResponseEntity.ok(this.appControlService.getForegroundApplication());
    }

    @GetMapping("launch-points")
    public ResponseEntity<Mono<LaunchPointsResponse>> getLaunchPoints() {
        return ResponseEntity.ok(this.appControlService.getLaunchPoints());
    }
}
