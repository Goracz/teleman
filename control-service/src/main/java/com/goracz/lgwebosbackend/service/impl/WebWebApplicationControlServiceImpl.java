package com.goracz.lgwebosbackend.service.impl;

import com.goracz.lgwebosbackend.model.request.LaunchAppRequest;
import com.goracz.lgwebosbackend.model.response.ApplicationListResponse;
import com.goracz.lgwebosbackend.model.response.LaunchPointsResponse;
import com.goracz.lgwebosbackend.service.WebApplicationControlService;
import com.goracz.lgwebosbackend.service.WebService;
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
    public Mono<Void> openApplication(String identifier) {
        return this.webClient
                .post()
                .uri("http://localhost:5000/api/v1/app/launch")
                .bodyValue(LaunchAppRequest.builder().id(identifier).build())
                .retrieve()
                .bodyToMono(Void.class)
                .retry(this.retriesCount)
                .log();
    }
}
