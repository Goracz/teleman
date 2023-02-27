package com.goracz.controlservice.service;

import com.goracz.controlservice.model.WebOSApplication;
import com.goracz.controlservice.model.response.ApplicationListResponse;
import com.goracz.controlservice.model.response.LaunchPointsResponse;
import reactor.core.publisher.Mono;

/**
 * Interface for interacting with the TV's applications
 */
public interface WebApplicationControlService {
    /**
     * Gets the installed applications' list of the TV
     * @return Response with list of applications
     */
    Mono<ApplicationListResponse> getApplicationList();

    /**
     * Gets applications' launch points
     * @return Response with list of application launch points
     */
    Mono<LaunchPointsResponse> getLaunchPoints();

    /**
     * Opens an application on the TV
     */
    Mono<Void> openApplication(WebOSApplication identifier);
}
