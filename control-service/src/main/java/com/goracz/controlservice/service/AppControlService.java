package com.goracz.controlservice.service;

import com.goracz.controlservice.model.WebOSApplication;
import com.goracz.controlservice.model.response.ApplicationListResponse;
import com.goracz.controlservice.model.response.ForegroundAppChangeResponse;
import com.goracz.controlservice.model.response.LaunchPointsResponse;
import reactor.core.publisher.Mono;

public interface AppControlService {
    /**
     * Gets all applications available for launch on the TV
     * @return List of applications
     */
    Mono<ApplicationListResponse> getApplications();

    /**
     * Launches an application on the TV
     * @param application Application to launch
     */
    Mono<Void> launchApp(WebOSApplication application);

    /**
     * Gets the currently running application on the TV
     * @return Currently running application
     */
    Mono<ForegroundAppChangeResponse> getForegroundApplication();

    /**
     * Gets the launch points for the TV
     * @return Launch points
     */
    Mono<LaunchPointsResponse> getLaunchPoints();
}
