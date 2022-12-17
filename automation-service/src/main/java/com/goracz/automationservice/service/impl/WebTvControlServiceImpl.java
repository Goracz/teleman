package com.goracz.automationservice.service.impl;

import com.goracz.automationservice.service.WebTvControlService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class WebTvControlServiceImpl implements WebTvControlService {
    @Value(("${tvControlService.baseUrl}"))
    private final String baseUrl;

    private final WebClient webClient;

    @Override
    public Mono<Void> turnOnTv() {
        return this.webClient.post()
                .uri("%s/system/power/on", baseUrl)
                .retrieve()
                .bodyToMono(Void.class);
    }

    @Override
    public Mono<Void> turnOffTv() {
        return this.webClient.post()
                .uri("%s/system/power/off", baseUrl)
                .retrieve()
                .bodyToMono(Void.class);
    }

    @Override
    public Mono<Void> setChannel(String channelId) {
        return this.webClient.post()
                .uri("%s/tv/channels", baseUrl)
                .bodyValue(Void.class)
                .retrieve()
                .bodyToMono(Void.class);
    }

    @Override
    public Mono<Void> setVolume(int value) {
        return this.webClient.post()
                .uri("%s/media/volume", baseUrl)
                .bodyValue(Void.class)
                .retrieve()
                .bodyToMono(Void.class);
    }

    @Override
    public Mono<Void> openApplication(String applicationId) {
        return this.webClient.post()
                .uri("%s/app/open", baseUrl)
                .bodyValue(Void.class)
                .retrieve()
                .bodyToMono(Void.class);
    }
}
