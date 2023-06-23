package com.goracz.controlservice.service;

import com.goracz.controlservice.dto.media.volume.SetVolumeDto;
import com.goracz.controlservice.exception.KafkaConsumeFailException;
import com.goracz.controlservice.model.response.GetVolumeResponse;

import org.apache.kafka.clients.consumer.ConsumerRecord;

import reactor.core.publisher.Mono;

/**
 * Interface for TV media controls
 */
public interface MediaControlService {
    /**
     * Gets the TV's current volume.
     * 
     * @return Response with the current volume.
     */
    Mono<GetVolumeResponse> getVolume();

    /**
     * Decreases the TV's volume by 1.
     */
    Mono<Void> increaseVolume();

    /**
     * Increases the TV's volume by 1.
     */
    Mono<Void> decreaseVolume();

    /**
     * Sets the TV's volume.
     * 
     * @param setVolumeDto DTO with the volume to set.
     * @return Response with the new volume.
     */
    Mono<Object> setVolume(SetVolumeDto setVolumeDto);

    /**
     * Listens for volume change events and handles them
     * @param message Message received through MQ
     * @throws KafkaConsumeFailException If the message couldn't be processed
     */
    void onVolumeChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException;
}
