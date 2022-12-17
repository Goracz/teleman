package com.goracz.controlservice.service;

import com.goracz.controlservice.model.response.PowerStateResponse;
import com.goracz.controlservice.model.response.SoftwareInformationResponse;

import reactor.core.publisher.Mono;

/**
 * Interface for controlling the TV's system
 */
public interface SystemControlService {
    /**
     * Gets the software's metadata that is currently running on the TV.
     * @return Software metadata of the TV.
     */
    Mono<SoftwareInformationResponse> getSoftwareInformation();

    /**
     * Gets the TV's current power state.
     * @return A current power state of the TV.
     */
    Mono<PowerStateResponse> getPowerState();

    /**
     * Turns the TV on.
     */
    Mono<Void> turnOn();

    /**
     * Turns the TV off.
     */
    Mono<Void> turnOff();
}
