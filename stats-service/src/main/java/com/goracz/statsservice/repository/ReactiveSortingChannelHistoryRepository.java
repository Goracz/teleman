package com.goracz.statsservice.repository;

import com.goracz.statsservice.entity.ChannelHistory;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.ZonedDateTime;

@Repository
public interface ReactiveSortingChannelHistoryRepository extends ReactiveMongoRepository<ChannelHistory, String> {
    Mono<ChannelHistory> findFirstByOrderByStartDesc();
    Flux<ChannelHistory> findAllByChannelId(String channelId);
    Flux<ChannelHistory> findAllByStartBetween(ZonedDateTime start, ZonedDateTime end);
}
