package com.goracz.telemanautomationservice.service.impl;

import com.goracz.telemanautomationservice.entity.AutomationRule;
import com.goracz.telemanautomationservice.model.request.AddAutomationRuleRequest;
import com.goracz.telemanautomationservice.model.response.EventCategory;
import com.goracz.telemanautomationservice.repository.ReactiveSortingAutomationRuleRepository;
import com.goracz.telemanautomationservice.service.AutomationRuleService;
import com.goracz.telemanautomationservice.service.AutomationSchedulerService;
import com.goracz.telemanautomationservice.service.EventService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.concurrent.ScheduledFuture;

@Service
public class AutomationRuleServiceImpl implements AutomationRuleService {
    private final ReactiveSortingAutomationRuleRepository automationRuleRepository;
    private final AutomationSchedulerService automationSchedulerService;
    private final EventService<AutomationRule> eventService;

    public AutomationRuleServiceImpl(ReactiveSortingAutomationRuleRepository automationRuleRepository,
                                     AutomationSchedulerService automationSchedulerService,
                                     EventService<AutomationRule> eventService) {
        this.automationRuleRepository = automationRuleRepository;
        this.automationSchedulerService = automationSchedulerService;
        this.eventService = eventService;

        this.enqueueAllExisting()
                .subscribeOn(Schedulers.boundedElastic())
                .subscribe();
    }

    private Flux<ScheduledFuture<?>> enqueueAllExisting() {
        return this.getAll()
                .flatMap(automationSchedulerService::enqueue);
    }

    @Override
    public Flux<AutomationRule> getAll() {
        return this.automationRuleRepository.findAll();
    }

    @Override
    public Mono<AutomationRule> getById(String id) {
        return this.automationRuleRepository.findById(id);
    }

    @Override
    public Mono<AutomationRule> add(AddAutomationRuleRequest addAutomationRuleRequest) {
        return this.automationRuleRepository
                .save(AutomationRule.fromDto(addAutomationRuleRequest))
                .doOnNext(this::notifyListenersAboutCreation)
                .doOnNext(this.automationSchedulerService::enqueue);
    }

    private void notifyListenersAboutCreation(AutomationRule rule) {
        this.eventService
                .emit(rule, EventCategory.AUTOMATION_RULE_ADDED)
                .subscribe();
    }

    @Override
    public Mono<AutomationRule> update(String id, AddAutomationRuleRequest automationRule) {
        return this.automationRuleRepository
                .findById(id)
                .map(persistedRule -> persistedRule.updateWithDto(automationRule))
                .flatMap(this.automationRuleRepository::save)
                .doOnNext(this::notifyListenersAboutModification)
                .doOnNext(this.automationSchedulerService::dequeue)
                .doOnNext(this.automationSchedulerService::enqueue);
    }

    private void notifyListenersAboutModification(AutomationRule rule) {
        this.eventService
                .emit(rule, EventCategory.AUTOMATION_RULE_MODIFIED)
                .subscribe();
    }

    @Override
    public Mono<AutomationRule> delete(String id) {
        return this.automationRuleRepository
                .findById(id)
                .flatMap(this::deleteFromDatabase)
                .doOnNext(this::notifyListenersAboutDeletion)
                .doOnNext(this.automationSchedulerService::dequeue);
    }

    private Mono<AutomationRule> deleteFromDatabase(AutomationRule rule) {
        return this.automationRuleRepository
                .delete(rule)
                .map(result -> rule);
    }

    private void notifyListenersAboutDeletion(AutomationRule rule) {
        this.eventService
                .emit(rule, EventCategory.AUTOMATION_RULE_REMOVED)
                .subscribe();
    }
}
