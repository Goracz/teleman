package com.goracz.statsservice.service.impl;

import com.goracz.statsservice.model.response.ForegroundAppChangeResponse;
import com.goracz.statsservice.service.WebForegroundApplicationService;
import com.goracz.statsservice.service.WebService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class WebForegroundApplicationServiceImpl extends WebService implements WebForegroundApplicationService {
    private final WebClient webClient;
    @Value("${interface.uri}")
    private String interfaceUri;

    @Override
    public Mono<ForegroundAppChangeResponse> getForegroundApplication() {
        return this.webClient
                .get()
                .uri(String.format("%s/api/v1/app/foreground", interfaceUri))
                .retrieve()
                .bodyToMono(ForegroundAppChangeResponse.class)
                .retry(this.retriesCount)
                .publishOn(Schedulers.immediate());
    }
}
