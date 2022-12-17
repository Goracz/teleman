package com.goracz.telemanautomationservice.controller;

import com.goracz.telemanautomationservice.entity.AutomationRule;
import com.goracz.telemanautomationservice.model.request.AddAutomationRuleRequest;
import com.goracz.telemanautomationservice.service.AutomationRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(path = "/api/v1/automations")
@RequiredArgsConstructor
public class AutomationsController {
    private final AutomationRuleService automationRuleService;

    @GetMapping
    public ResponseEntity<Flux<AutomationRule>> getAll() {
        return ResponseEntity.ok(this.automationRuleService.getAll());
    }

    @PostMapping
    public ResponseEntity<Mono<AutomationRule>> add(@RequestBody AddAutomationRuleRequest addAutomationRuleRequest) {
        return ResponseEntity.ok(this.automationRuleService.add(addAutomationRuleRequest));
    }

    @PatchMapping("{id}")
    public ResponseEntity<Mono<AutomationRule>> update(
            @PathVariable("id") String id, @RequestBody AddAutomationRuleRequest addAutomationRuleRequest) {
        return ResponseEntity.ok(this.automationRuleService.update(id, addAutomationRuleRequest));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Mono<AutomationRule>> delete(@PathVariable("id") String id) {
        return ResponseEntity.ok(this.automationRuleService.delete(id));
    }
}
