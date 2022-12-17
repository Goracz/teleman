package com.goracz.lgwebosbackend.service;

import com.goracz.lgwebosbackend.dto.media.volume.SetVolumeDto;
import com.goracz.lgwebosbackend.exception.KafkaConsumeFailException;
import com.goracz.lgwebosbackend.model.response.GetVolumeResponse;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import reactor.core.publisher.Mono;

public interface MediaControlService {
    /**
     * Gets the TV's current volume.
     * 
     * @return Response with the current volume.
     */
    Mono<GetVolumeResponse> getVolume();

    /**
     * Sets the TV's volume.
     * 
     * @param setVolumeDto DTO with the volume to set.
     * @return Response with the new volume.
     */
    Mono<Object> setVolume(SetVolumeDto setVolumeDto);

    void onVolumeChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException;
}
