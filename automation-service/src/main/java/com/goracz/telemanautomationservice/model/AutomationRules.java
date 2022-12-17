package com.goracz.telemanautomationservice.model;

import com.goracz.telemanautomationservice.entity.AutomationRule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AutomationRules {
    private Collection<AutomationRule> automationRules;

    public static Mono<AutomationRules> fromRules(Flux<AutomationRule> automationRules) {
        return automationRules.collectList().map(rules -> AutomationRules.builder().automationRules(rules).build());
    }
}
