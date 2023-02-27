package com.goracz.controlservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.controlservice.component.RedisCacheProvider;
import com.goracz.controlservice.exception.KafkaConsumeFailException;
import com.goracz.controlservice.model.WebOSApplication;
import com.goracz.controlservice.model.response.ApplicationListResponse;
import com.goracz.controlservice.model.response.ForegroundAppChangeResponse;
import com.goracz.controlservice.model.response.LaunchPointsResponse;
import com.goracz.controlservice.service.AppControlService;
import com.goracz.controlservice.service.WebService;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class AppControlServiceImpl extends WebService implements AppControlService {
    private static final String APPLICATION_LIST_CACHE_KEY = "applications";
    private static final String FOREGROUND_APP_CACHE_KEY = "foreground-app";
    private static final String LAUNCH_POINTS_CACHE_KEY = "launch-points";
    private final ObjectMapper objectMapper;
    private final WebClient webClient;
    private final RedisCacheProvider redisCacheProvider;

    @Override
    public Mono<ApplicationListResponse> getApplications() {
        return this.getApplicationsFromCache()
                .switchIfEmpty(this.getApplicationsFromInterface());
    }

    private Mono<ApplicationListResponse> getApplicationsFromCache() {
        return this.redisCacheProvider
                .getApplicationListCache()
                .get(APPLICATION_LIST_CACHE_KEY);
    }

    private Mono<ApplicationListResponse> getApplicationsFromInterface() {
        return this.webClient
                .get()
                .uri("http://localhost:5001/api/v1/apps")
                .retrieve()
                .bodyToMono(ApplicationListResponse.class)
                .retry(this.retriesCount);
    }

    @Override
    public Mono<Void> launchApp(WebOSApplication application) {
        return this.webClient
                .post()
                .uri("http://localhost:5001/api/v1/apps/launch")
                .retrieve()
                .bodyToMono(Void.class)
                .retry(this.retriesCount);
    }

    public Mono<ForegroundAppChangeResponse> getForegroundApplication() {
        return this.getForegroundApplicationFromCache()
                .switchIfEmpty(this.getForegroundApplicationFromInterface());
    }

    private Mono<ForegroundAppChangeResponse> getForegroundApplicationFromCache() {
        return this.redisCacheProvider
                .getForegroundAppCache()
                .get(FOREGROUND_APP_CACHE_KEY);
    }

    private Mono<ForegroundAppChangeResponse> getForegroundApplicationFromInterface() {
        return this.webClient
                .get()
                .uri("http://localhost:5001/api/v1/apps/foreground")
                .retrieve()
                .bodyToMono(ForegroundAppChangeResponse.class)
                .retry(this.retriesCount);
    }

    @Override
    public Mono<LaunchPointsResponse> getLaunchPoints() {
        return this.getLaunchPointsFromCache()
                .switchIfEmpty(this.getLaunchPointsFromInterface());
    }

    private Mono<LaunchPointsResponse> getLaunchPointsFromCache() {
        return this.redisCacheProvider
                .getLaunchPointsCache()
                .get(LAUNCH_POINTS_CACHE_KEY);
    }

    private Mono<LaunchPointsResponse> getLaunchPointsFromInterface() {
        return this.webClient
                .get()
                .uri("http://localhost:5001/api/v1/apps/launch-points")
                .retrieve()
                .bodyToMono(LaunchPointsResponse.class)
                .retry(this.retriesCount);
    }

    @KafkaListener(topics = "channel-change")
    private void onForegroundAppChange(ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            this.handleForegroundAppChange(message)
                    .subscribeOn(Schedulers.parallel())
                    .subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    private Mono<Void> handleForegroundAppChange(ConsumerRecord<String, String> message) {
        return this.getForegroundAppChangeResponseFromMqMessage(message)
                .map(this::updateForegroundAppCache)
                .then();
    }

    private Mono<ForegroundAppChangeResponse> updateForegroundAppCache(ForegroundAppChangeResponse response) {
        return this.redisCacheProvider
                .getForegroundAppCache()
                .set(FOREGROUND_APP_CACHE_KEY, response)
                .map(ignored -> response);
    }

    private Mono<ForegroundAppChangeResponse> getForegroundAppChangeResponseFromMqMessage(
            ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> this.objectMapper.readValue(message.value(), ForegroundAppChangeResponse.class));
    }
}
