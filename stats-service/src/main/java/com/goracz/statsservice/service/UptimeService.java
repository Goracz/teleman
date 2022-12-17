package com.goracz.statsservice.service;

import com.goracz.statsservice.entity.UptimeLog;
import com.goracz.statsservice.exception.KafkaConsumeFailException;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import reactor.core.publisher.Mono;

public interface UptimeService {
    /**
     * Gets the latest uptime log entry.
     * @return Latest uptime log entry of the TV.
     */
    Mono<UptimeLog> getLatestUptimeLog();

    void onPowerStateChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException;
}
