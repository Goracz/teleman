package com.goracz.controlservice.service.impl;

import com.goracz.controlservice.component.RedisCacheProvider;
import com.goracz.controlservice.model.response.PowerStateResponse;
import com.goracz.controlservice.model.response.SoftwareInformationResponse;
import com.goracz.controlservice.service.SystemControlService;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class SystemControlServiceImpl implements SystemControlService {

    /**
     * The number of tries to write the given API response to cache
     * in case of failure of the initial try.
     */
    private static final int CACHE_WRITE_TRIES = 3;

    /**
     * The number of the tries to send an HTTP request to the LG WebOS interface
     * in case of failure of the initial try.
     */
    private static final int INTERFACE_REQUEST_TRIES = 3;

    private static final String SOFTWARE_INFORMATION_CACHE_KEY = "system:software";

    private static final String POWER_STATE_CACHE_KEY = "system:power:state";

    private final WebClient webClient;
    private final RedisCacheProvider cacheProvider;


    public SystemControlServiceImpl(WebClient webClient,
                                    RedisCacheProvider cacheProvider) {
        this.webClient = webClient;
        this.cacheProvider = cacheProvider;
    }

    @Override
    public Mono<SoftwareInformationResponse> getSoftwareInformation() {
        return this.getSoftwareInformationFromCache()
                .switchIfEmpty(this.getSoftwareInformationFromTv())
                .flatMap(this::writeSoftwareInformationToCache);
    }

    public Mono<PowerStateResponse> getPowerState() {
        return this.getPowerStateFromCache()
                .switchIfEmpty(this.getPowerStateFromTv())
                .flatMap(this::writePowerStateToCache);
    }

    @Override
    public Mono<Void> turnOff() {
        return this.webClient
                .post()
                .uri("/system/power/off")
                .retrieve()
                .bodyToMono(Void.class)
                .retry(INTERFACE_REQUEST_TRIES)
                .log();
    }

    @Override
    public Mono<Void> turnOn() {
        return this.webClient
                .post()
                .uri("/system/power/on")
                .retrieve()
                .bodyToMono(Void.class)
                .retry(INTERFACE_REQUEST_TRIES)
                .log();
    }

    private Mono<SoftwareInformationResponse> getSoftwareInformationFromTv() {
        return this.webClient
                .get()
                .uri("/system/info")
                .retrieve()
                .bodyToMono(SoftwareInformationResponse.class)
                .retry(INTERFACE_REQUEST_TRIES)
                .log();
    }

    private Mono<SoftwareInformationResponse> getSoftwareInformationFromCache() {
        return this.cacheProvider.getSoftwareInformationResponseCache().get(SOFTWARE_INFORMATION_CACHE_KEY);
    }

    private Mono<SoftwareInformationResponse> writeSoftwareInformationToCache(
            SoftwareInformationResponse softwareInformation) {
        return this.cacheProvider
                .getSoftwareInformationResponseCache()
                .set(SOFTWARE_INFORMATION_CACHE_KEY, softwareInformation)
                .map(response -> softwareInformation)
                .retry(CACHE_WRITE_TRIES)
                .log();
    }

    private Mono<PowerStateResponse> getPowerStateFromCache() {
        return this.cacheProvider.getPowerStateResponseCache().get(POWER_STATE_CACHE_KEY);
    }

    private Mono<PowerStateResponse> getPowerStateFromTv() {
        return this.webClient
                .get()
                .uri("/system/power/state")
                .retrieve()
                .bodyToMono(PowerStateResponse.class)
                .retry(INTERFACE_REQUEST_TRIES)
                .log();
    }

    private Mono<PowerStateResponse> writePowerStateToCache(PowerStateResponse powerState) {
        return this.cacheProvider.getPowerStateResponseCache()
                .set(POWER_STATE_CACHE_KEY, powerState)
                .map(response -> powerState)
                .retry(CACHE_WRITE_TRIES)
                .log();
    }
}
