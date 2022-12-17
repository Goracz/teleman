package com.goracz.controlservice.controller.system;

import com.goracz.controlservice.model.response.SoftwareInformationResponse;
import com.goracz.controlservice.service.SystemControlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/system")
@RequiredArgsConstructor
public class SystemSoftwareController {
    private final SystemControlService systemControlService;

    @GetMapping("software")
    public ResponseEntity<Mono<SoftwareInformationResponse>> getSoftwareInformation() {
        return ResponseEntity.ok(this.systemControlService.getSoftwareInformation());
    }
}
