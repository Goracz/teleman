package com.goracz.automationservice.model.response;

import com.goracz.automationservice.entity.AutomationRule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import reactor.core.publisher.Flux;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AutomationRuleResponse {
    private Flux<AutomationRule> automationRules;
}
