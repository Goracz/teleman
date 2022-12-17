package com.goracz.statsservice.repository;

import com.goracz.statsservice.entity.UptimeLog;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface ReactiveUptimeRepository extends ReactiveMongoRepository<UptimeLog, String> {
    Mono<UptimeLog> findFirstByOrderByTurnOnTimeDesc();
}
