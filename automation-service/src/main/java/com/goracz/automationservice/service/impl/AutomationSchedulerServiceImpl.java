package com.goracz.automationservice.service.impl;

import com.goracz.automationservice.entity.AutomationAction;
import com.goracz.automationservice.entity.AutomationRule;
import com.goracz.automationservice.exception.JobBuildException;
import com.goracz.automationservice.exception.JobScheduleException;
import com.goracz.automationservice.service.AutomationSchedulerService;
import com.goracz.automationservice.service.WebTvControlService;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.Comparator;
import java.util.HashMap;
import java.util.Objects;
import java.util.concurrent.ScheduledFuture;

@Service
@Configuration
@EnableScheduling
@Component
public class AutomationSchedulerServiceImpl implements AutomationSchedulerService {
    private final TaskScheduler taskScheduler;
    private final WebTvControlService webTvControlService;
    private final HashMap<String, ScheduledFuture<?>> scheduledFutures = new HashMap<>();

    public AutomationSchedulerServiceImpl(TaskScheduler taskScheduler,
                                          WebTvControlService webTvControlService) {
        this.taskScheduler = taskScheduler;
        this.webTvControlService = webTvControlService;
    }

    @Override
    public Flux<ScheduledFuture<?>> enqueue(AutomationRule automationRule) {
        return this.getActionsOrderedByPriority(automationRule)
                .flatMap(this::buildJobFromActions)
                .map(job -> this.scheduleJob(automationRule, job))
                .flatMap(job -> this.saveScheduledJobInMemory(automationRule, job));
    }

    private Flux<AutomationAction> getActionsOrderedByPriority(AutomationRule automationRule) {
        return Flux.fromIterable(automationRule.getActions())
                .sort(Comparator.comparing(AutomationAction::getPriority))
                .publishOn(Schedulers.single());
    }

    private ScheduledFuture<?> scheduleJob(AutomationRule rule, Runnable job) {
        // TODO: If a rule is being deleted before it could execute, this job will still be executed
        //  and is going to face an exception.

        //                        taskScheduler.schedule(
        //                                () -> this.automationRuleService.delete(automationRule.getId()).subscribe(),
        //                                automationRule.getExecutionTime().toInstant());

        if (rule.isCronJob()) {
            return this.scheduleCronJob(rule, job);
        } else if (rule.isDateJob()) {
            return this.scheduleDateJob(rule, job);
        }

        throw new JobScheduleException("The job did not match any known automation schedule kind.");
    }

    private Mono<ScheduledFuture<?>> saveScheduledJobInMemory(AutomationRule rule, ScheduledFuture<?> job) {
        return Mono.just(Objects.requireNonNull(this.scheduledFutures.put(rule.getId(), job)));
    }

    private ScheduledFuture<?> scheduleCronJob(AutomationRule rule, Runnable job) {
        return this.taskScheduler.schedule(job, new CronTrigger(String.format("%s%s", "* ", rule.getCronSchedule())));
    }

    private ScheduledFuture<?> scheduleDateJob(AutomationRule rule, Runnable job) {
        return this.taskScheduler.schedule(job, rule.getExecutionTime().toInstant());
    }

    @Override
    public Mono<Boolean> dequeue(AutomationRule automationRule) {
        return Mono.fromCallable(() -> this.scheduledFutures
                .get(automationRule.getId())
                .cancel(true));
    }

    private Mono<Runnable> buildJobFromActions(AutomationAction automationAction) throws JobBuildException {
        switch (automationAction.getType()) {
            case TURN_ON -> {
                return Mono.fromCallable(() -> this.webTvControlService::turnOnTv);
            }
            case TURN_OFF -> {
                return Mono.fromCallable(() -> this.webTvControlService::turnOffTv);
            }
            case SET_VOLUME -> {
                return Mono.fromCallable(() -> () -> this.webTvControlService
                        .setVolume(automationAction.getVolume())
                        .subscribeOn(Schedulers.boundedElastic())
                        .subscribe());
            }
            case SET_CHANNEL -> {
                return Mono.fromCallable(() -> () -> this.webTvControlService
                        .setChannel(automationAction.getChannelId())
                        .subscribeOn(Schedulers.boundedElastic())
                        .subscribe());
            }
            case OPEN_APPLICATION -> {
                return Mono.fromCallable(() -> () -> this.webTvControlService.
                        openApplication(automationAction.getAppId())
                        .subscribeOn(Schedulers.boundedElastic())
                        .subscribe());
            }
        }

        throw new JobBuildException("The requested action type is either not implemented or does not exist.");
    }
}
