package com.goracz.telemanautomationservice.model.response;

import com.goracz.telemanautomationservice.entity.AutomationRule;
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
