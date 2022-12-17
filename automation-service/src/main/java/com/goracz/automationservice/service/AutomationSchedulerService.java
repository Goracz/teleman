package com.goracz.automationservice.service;

import com.goracz.automationservice.entity.AutomationRule;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.concurrent.ScheduledFuture;

public interface AutomationSchedulerService {
    Flux<ScheduledFuture<?>> enqueue(AutomationRule automationRule);
    Mono<Boolean> dequeue(AutomationRule automationRule);
}
