package com.goracz.controlservice.controller.meta;

import com.goracz.controlservice.model.response.ServiceDescription;
import com.goracz.controlservice.service.MetaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/meta")
@RequiredArgsConstructor
public class MetaController {
    private final MetaService metaService;

    @GetMapping
    public ResponseEntity<Mono<ServiceDescription>> describeService() {
        return ResponseEntity.ok(this.metaService.describeService());
    }
}
