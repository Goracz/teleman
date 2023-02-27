package com.goracz.controlservice.service.impl;

import com.goracz.controlservice.model.WebOSApplication;
import com.goracz.controlservice.model.request.LaunchAppRequest;
import com.goracz.controlservice.model.response.ApplicationListResponse;
import com.goracz.controlservice.model.response.LaunchPointsResponse;
import com.goracz.controlservice.service.WebApplicationControlService;
import com.goracz.controlservice.service.WebService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class WebWebApplicationControlServiceImpl extends WebService implements WebApplicationControlService {
    private final WebClient webClient;

    @Override
    public Mono<ApplicationListResponse> getApplicationList() {
        return this.webClient
                .get()
                .uri("http://localhost:5000/api/v1/app")
                .retrieve()
                .bodyToMono(ApplicationListResponse.class)
                .retry(this.retriesCount)
                .log();
    }

    @Override
    public Mono<LaunchPointsResponse> getLaunchPoints() {
        return this.webClient
                .get()
                .uri("http://localhost:5000/api/v1/app/launch-points")
                .retrieve()
                .bodyToMono(LaunchPointsResponse.class)
                .retry(this.retriesCount)
                .log();
    }

    @Override
    public Mono<Void> openApplication(WebOSApplication identifier) {
        return this.webClient
                .post()
                .uri("http://localhost:5000/api/v1/app/launch")
                .bodyValue(LaunchAppRequest.builder().application(identifier).build())
                .retrieve()
                .bodyToMono(Void.class)
                .retry(this.retriesCount)
                .log();
    }
}
