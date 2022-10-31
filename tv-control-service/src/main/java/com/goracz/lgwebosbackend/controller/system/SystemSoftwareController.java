package com.goracz.lgwebosbackend.controller.system;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.goracz.lgwebosbackend.model.response.SoftwareInformationResponse;
import com.goracz.lgwebosbackend.service.SystemControlService;

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
