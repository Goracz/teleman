package com.goracz.automationservice.controller;

import com.goracz.automationservice.entity.AutomationRule;
import com.goracz.automationservice.model.request.AddAutomationRuleRequest;
import com.goracz.automationservice.service.AutomationRuleService;
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(summary = "Get all automation rules")
    public ResponseEntity<Flux<AutomationRule>> getAll() {
        return ResponseEntity.ok(this.automationRuleService.getAll());
    }

    @PostMapping
    @Operation(summary = "Add a new automation rule")
    public ResponseEntity<Mono<AutomationRule>> add(@RequestBody AddAutomationRuleRequest addAutomationRuleRequest) {
        return ResponseEntity.ok(this.automationRuleService.add(addAutomationRuleRequest));
    }

    @PatchMapping("{id}")
    @Operation(summary = "Update an existing automation rule")
    public ResponseEntity<Mono<AutomationRule>> update(
            @PathVariable("id") String id, @RequestBody AddAutomationRuleRequest addAutomationRuleRequest) {
        return ResponseEntity.ok(this.automationRuleService.update(id, addAutomationRuleRequest));
    }

    @DeleteMapping("{id}")
    @Operation(summary = "Delete an existing automation rule")
    public ResponseEntity<Mono<AutomationRule>> delete(@PathVariable("id") String id) {
        return ResponseEntity.ok(this.automationRuleService.delete(id));
    }
}
