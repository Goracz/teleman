package com.goracz.telemanautomationservice.service;

import com.goracz.telemanautomationservice.entity.AutomationRule;
import com.goracz.telemanautomationservice.model.request.AddAutomationRuleRequest;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface AutomationRuleService {
    Flux<AutomationRule> getAll();
    Mono<AutomationRule> getById(String id);
    Mono<AutomationRule> add(AddAutomationRuleRequest addAutomationRuleRequest);
    Mono<AutomationRule> update(String id, AddAutomationRuleRequest automationRule);
    Mono<AutomationRule> delete(String id);
}
