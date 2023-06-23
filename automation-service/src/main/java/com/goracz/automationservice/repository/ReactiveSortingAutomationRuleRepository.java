package com.goracz.automationservice.repository;

import com.goracz.automationservice.entity.AutomationRule;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReactiveSortingAutomationRuleRepository extends ReactiveMongoRepository<AutomationRule, String> {
}
