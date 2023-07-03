package com.goracz.controlservice.service.impl;

import com.goracz.controlservice.model.WebOSApplication;
import com.goracz.controlservice.model.request.LaunchAppRequest;
import com.goracz.controlservice.model.response.ApplicationListResponse;
import com.goracz.controlservice.model.response.LaunchPointsResponse;
import com.goracz.controlservice.service.WebApplicationControlService;
import com.goracz.controlservice.service.WebService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class WebApplicationControlServiceImpl extends WebService implements WebApplicationControlService {
    private final WebClient webClient;
    @Value("${interface.uri}")
    private String interfaceUri;

    @Override
    public Mono<ApplicationListResponse> getApplicationList() {
        return this.webClient
                .get()
                .uri(String.format("%s/api/v1/app", interfaceUri))
                .retrieve()
                .bodyToMono(ApplicationListResponse.class)
                .retry(this.retriesCount)
                .log()
                .publishOn(Schedulers.immediate());
    }

    @Override
    public Mono<LaunchPointsResponse> getLaunchPoints() {
        return this.webClient
                .get()
                .uri(String.format("%s/api/v1/app/launch-points", interfaceUri))
                .retrieve()
                .bodyToMono(LaunchPointsResponse.class)
                .retry(this.retriesCount)
                .log()
                .publishOn(Schedulers.immediate());
    }

    @Override
    public Mono<Void> openApplication(WebOSApplication identifier) {
        return this.webClient
                .post()
                .uri(String.format("%s/api/v1/app/launch", interfaceUri))
                .bodyValue(LaunchAppRequest.builder().application(identifier).build())
                .retrieve()
                .bodyToMono(Void.class)
                .retry(this.retriesCount)
                .log()
                .publishOn(Schedulers.immediate());
    }
}
