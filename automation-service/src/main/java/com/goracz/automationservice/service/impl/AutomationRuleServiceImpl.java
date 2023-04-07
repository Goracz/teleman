package com.goracz.automationservice.service.impl;

import com.goracz.automationservice.entity.AutomationRule;
import com.goracz.automationservice.model.request.AddAutomationRuleRequest;
import com.goracz.automationservice.model.response.EventCategory;
import com.goracz.automationservice.repository.ReactiveSortingAutomationRuleRepository;
import com.goracz.automationservice.service.AutomationRuleService;
import com.goracz.automationservice.service.AutomationSchedulerService;
import com.goracz.automationservice.service.EventService;
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
                .publishOn(Schedulers.immediate())
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
                .publishOn(Schedulers.immediate())
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
                .map(result -> rule)
                .publishOn(Schedulers.boundedElastic());
    }

    private void notifyListenersAboutDeletion(AutomationRule rule) {
        this.eventService
                .emit(rule, EventCategory.AUTOMATION_RULE_REMOVED)
                .publishOn(Schedulers.immediate())
                .subscribe();
    }
}
