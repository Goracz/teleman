package com.goracz.automationservice.service;

import com.goracz.automationservice.entity.AutomationRule;
import com.goracz.automationservice.model.request.AddAutomationRuleRequest;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface AutomationRuleService {
    Flux<AutomationRule> getAll();
    Mono<AutomationRule> getById(String id);
    Mono<AutomationRule> add(AddAutomationRuleRequest addAutomationRuleRequest);
    Mono<AutomationRule> update(String id, AddAutomationRuleRequest automationRule);
    Mono<AutomationRule> delete(String id);
}
