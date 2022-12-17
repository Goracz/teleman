package com.goracz.telemanautomationservice.repository;

import com.goracz.telemanautomationservice.entity.AutomationRule;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReactiveSortingAutomationRuleRepository extends ReactiveMongoRepository<AutomationRule, String> {
}
