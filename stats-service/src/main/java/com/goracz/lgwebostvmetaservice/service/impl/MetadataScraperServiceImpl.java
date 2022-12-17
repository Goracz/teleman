package com.goracz.lgwebostvmetaservice.service.impl;

import com.goracz.lgwebostvmetaservice.dto.IPTVResponse;
import com.goracz.lgwebostvmetaservice.service.CacheManager;
import com.goracz.lgwebostvmetaservice.service.MetadataScraperService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;

@Service
public class MetadataScraperServiceImpl implements MetadataScraperService {
    private static final String CACHE_KEY = "iptv:%s";

    private final WebClient webClient;
    private final CacheManager<String, IPTVResponse> iptvResponseCacheManager;

    public MetadataScraperServiceImpl(WebClient webClient,
                                      CacheManager<String, IPTVResponse> iptvResponseCacheManager) {
        this.webClient = webClient;
        this.iptvResponseCacheManager = iptvResponseCacheManager;
        this.preWarmCache();
    }

    @Override
    public Mono<IPTVResponse> scrape(String countryCode) {
        return this.iptvResponseCacheManager
                .read(String.format(CACHE_KEY, countryCode))
                .switchIfEmpty(countryCode.equals("hu") ? this.scrapeAllHungarianSources() : this.webClient
                        .get()
                        .uri(String.format("https://iptv-org.github.io/epg/guides/%s.json", countryCode))
                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class)))
                        .publishOn(Schedulers.boundedElastic())
                .flatMap(response -> {
                    this.iptvResponseCacheManager
                            .write(String.format(CACHE_KEY, countryCode), response, Duration.ofDays(1))
                            .subscribeOn(Schedulers.parallel())
                            .subscribe();
                    return Mono.just(response);
                })
                .log();
    }

    @Async
    @Scheduled(cron = "* 0 3 * * *")
    public void preWarmCache() {
        Flux.just("hu")
                .flatMap(this::scrape)
                .parallel(1000)
                .runOn(Schedulers.parallel())
                .subscribe();
    }

    /**
     * Scrapes multiple EPG sources and merges them.
     * @return a merged EPG response
     * @implNote the data returned by this method contains redundancy,
     * as the same channel can be present in multiple sources
     */
    private Mono<IPTVResponse> scrapeAllHungarianSources() {
        return Flux.just(
                this.webClient
                        .get()
                        .uri("https://iptv-org.github.io/epg/guides/hu/mediaklikk.hu.epg.json")
                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class)),
                this.webClient
                        .get()
                        .uri("https://iptv-org.github.io/epg/guides/hu/musor.tv.epg.json")
                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class)),
                this.webClient
                        .get()
                        .uri("https://iptv-org.github.io/epg/guides/hu/tv.yettel.hu.epg.json")
                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class)),
                this.webClient
                        .get()
                        .uri("https://iptv-org.github.io/epg/guides/hu/tvmusor.hu.epg.json")
                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class))
        )
                .flatMap(response -> response)
                .collectList()
                .map(responses -> {
                    final IPTVResponse response = new IPTVResponse();
                    responses.forEach(r -> {
                        if (response.getChannels() == null) {
                            response.setChannels(r.getChannels());
                        } else {
                            response.getChannels().addAll(r.getChannels());
                        }
                        if (response.getPrograms() == null) {
                            response.setPrograms(r.getPrograms());
                        } else {
                            response.getPrograms().addAll(r.getPrograms());
                        }
                    });
                    return response;
                });
    }
}
