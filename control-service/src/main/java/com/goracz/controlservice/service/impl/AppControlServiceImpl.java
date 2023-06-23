package com.goracz.controlservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goracz.controlservice.component.RedisCacheProvider;
import com.goracz.controlservice.exception.KafkaConsumeFailException;
import com.goracz.controlservice.model.request.LaunchAppRequest;
import com.goracz.controlservice.model.response.ApplicationListResponse;
import com.goracz.controlservice.model.response.ForegroundAppChangeResponse;
import com.goracz.controlservice.model.response.LaunchPointsResponse;
import com.goracz.controlservice.service.AppControlService;
import com.goracz.controlservice.service.WebService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppControlServiceImpl extends WebService implements AppControlService {
    private static final String APPLICATION_LIST_CACHE_KEY = "applications";
    private static final String FOREGROUND_APP_CACHE_KEY = "foreground-app";
    private static final String LAUNCH_POINTS_CACHE_KEY = "launch-points";
    private final ObjectMapper objectMapper;
    private final WebClient webClient;
    private final RedisCacheProvider redisCacheProvider;
    @Value("${interface.uri}")
    private String interfaceUri;

    @Override
    public Mono<ApplicationListResponse> getApplications() {
        return this.getApplicationsFromCache()
                .switchIfEmpty(this.getApplicationsFromInterface()
                        .doOnNext(this::writeApplicationListToCache));
    }

    private Mono<ApplicationListResponse> getApplicationsFromCache() {
        return this.redisCacheProvider
                .getApplicationListCache()
                .get(APPLICATION_LIST_CACHE_KEY)
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<ApplicationListResponse> getApplicationsFromInterface() {
        return this.webClient
                .get()
                .uri(String.format("%s/api/v1/app", interfaceUri))
                .retrieve()
                .bodyToMono(ApplicationListResponse.class)
                .retry(this.retriesCount)
                .publishOn(Schedulers.immediate());
    }

    private Mono<Void> writeApplicationListToCache(final ApplicationListResponse applicationList) {
        return this.redisCacheProvider
                .getApplicationListCache()
                .set(APPLICATION_LIST_CACHE_KEY, applicationList)
                .then()
                .publishOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<Void> launchApp(final String applicationId) {
        return this.webClient
                .post()
                .uri(String.format("%s/api/v1/app/launch", interfaceUri))
                .bodyValue(LaunchAppRequest.builder().applicationId(applicationId).build())
                .retrieve()
                .bodyToMono(Void.class)
                .retry(this.retriesCount)
                .publishOn(Schedulers.immediate());
    }

    public Mono<ForegroundAppChangeResponse> getForegroundApplication() {
        return this.getForegroundApplicationFromCache()
                .switchIfEmpty(this.getForegroundApplicationFromInterface()
                        .doOnNext(this::writeForegroundAppToCache));
    }

    private Mono<ForegroundAppChangeResponse> getForegroundApplicationFromCache() {
        return this.redisCacheProvider
                .getForegroundAppCache()
                .get(FOREGROUND_APP_CACHE_KEY)
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<ForegroundAppChangeResponse> getForegroundApplicationFromInterface() {
        return this.webClient
                .get()
                .uri(String.format("%s/api/v1/app/foreground", interfaceUri))
                .retrieve()
                .bodyToMono(ForegroundAppChangeResponse.class)
                .retry(this.retriesCount)
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<Void> writeForegroundAppToCache(final ForegroundAppChangeResponse response) {
        return this.redisCacheProvider
                .getForegroundAppCache()
                .set(FOREGROUND_APP_CACHE_KEY, response)
                .then()
                .publishOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<LaunchPointsResponse> getLaunchPoints() {
        return this.getLaunchPointsFromCache()
                .switchIfEmpty(this.getLaunchPointsFromInterface()
                        .doOnNext(this::writeLaunchPointsToCache));
    }

    private Mono<LaunchPointsResponse> getLaunchPointsFromCache() {
        return this.redisCacheProvider
                .getLaunchPointsCache()
                .get(LAUNCH_POINTS_CACHE_KEY)
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<LaunchPointsResponse> getLaunchPointsFromInterface() {
        return this.webClient
                .get()
                .uri(String.format("%s/api/v1/app/launch-points", interfaceUri))
                .retrieve()
                .bodyToMono(LaunchPointsResponse.class)
                .retry(this.retriesCount)
                .publishOn(Schedulers.immediate());
    }

    private Mono<Void> writeLaunchPointsToCache(final LaunchPointsResponse response) {
        return this.redisCacheProvider
                .getLaunchPointsCache()
                .set(LAUNCH_POINTS_CACHE_KEY, response)
                .doOnNext(ignored -> response.getLaunchPoints().forEach(launchPoint -> {
                    this.downloadLaunchPointImage(launchPoint.getLargeIcon())
                            .flatMap(imageBytes -> this.writeLaunchPointImageToCache(launchPoint.getId(), imageBytes))
                            .subscribe();
                }))
                .then()
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<byte[]> downloadLaunchPointImage(final String imageUrl) {
        return this.webClient
                .get()
                .uri(imageUrl)
                .retrieve()
                .bodyToMono(byte[].class);
    }

    private Mono<Void> writeLaunchPointImageToCache(final String launchPointId, final byte[] imageBytes) {
        return this.redisCacheProvider
                .getLaunchPointImageCache()
                .set(launchPointId, imageBytes)
                .then();
    }

    @KafkaListener(topics = "channel-change")
    private void onForegroundAppChange(final ConsumerRecord<String, String> message) throws KafkaConsumeFailException {
        try {
            this.handleForegroundAppChange(message)
                    .subscribeOn(Schedulers.parallel())
                    .subscribe();
        } catch (Exception exception) {
            throw new KafkaConsumeFailException(exception.getMessage());
        }
    }

    private Mono<Void> handleForegroundAppChange(final ConsumerRecord<String, String> message) {
        return this.getForegroundAppChangeResponseFromMqMessage(message)
                .doOnNext(foregroundAppChange ->
                        log.debug("[handleForegroundAppChange] @foregroundAppChange: {}", foregroundAppChange))
                .map(this::updateForegroundAppCache)
                .then();
    }

    private Mono<ForegroundAppChangeResponse> updateForegroundAppCache(final ForegroundAppChangeResponse response) {
        return this.redisCacheProvider
                .getForegroundAppCache()
                .set(FOREGROUND_APP_CACHE_KEY, response)
                .map(ignored -> response)
                .publishOn(Schedulers.boundedElastic());
    }

    private Mono<ForegroundAppChangeResponse> getForegroundAppChangeResponseFromMqMessage(
            final ConsumerRecord<String, String> message) {
        return Mono.fromCallable(() -> this.objectMapper.readValue(message.value(), ForegroundAppChangeResponse.class))
                .publishOn(Schedulers.boundedElastic());
    }
}
