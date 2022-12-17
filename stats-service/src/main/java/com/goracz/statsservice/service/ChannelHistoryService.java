package com.goracz.statsservice.service;

import com.goracz.statsservice.entity.ChannelHistory;
import com.goracz.statsservice.exception.KafkaConsumeFailException;
import com.goracz.statsservice.model.request.ChannelHistoryRequest;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ChannelHistoryService {
    /**
     * Gets all channel history entries that were created between a given time range
     * @param channelHistoryRequest Object containing the time range
     * @return Flux of channel history entries
     */
    Flux<ChannelHistory> getByTimeRange(ChannelHistoryRequest channelHistoryRequest);
    /**
     * Adds a channel history entry to the database
     * @param channelHistory Channel history entry to persist
     * @return Persisted channel history object
     */
    Mono<ChannelHistory> add(ChannelHistory channelHistory);

    /**
     * Removes a channel history entry from the database
     * @param channelHistoryId ID of the channel history entry to remove
     */
    Mono<Void> delete(String channelHistoryId);

    void onChannelChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException;

    void onPowerStateChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException;
}
