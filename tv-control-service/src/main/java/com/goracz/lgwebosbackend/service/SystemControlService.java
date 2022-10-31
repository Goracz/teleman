package com.goracz.lgwebosbackend.service;

import com.goracz.lgwebosbackend.model.response.PowerStateResponse;
import com.goracz.lgwebosbackend.model.response.SoftwareInformationResponse;

import reactor.core.publisher.Mono;

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
