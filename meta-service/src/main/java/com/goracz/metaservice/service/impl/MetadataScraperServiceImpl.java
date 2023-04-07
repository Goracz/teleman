package com.goracz.metaservice.service.impl;

import com.goracz.metaservice.component.RedisCacheProvider;
import com.goracz.metaservice.dto.IPTVResponse;
import com.goracz.metaservice.service.MetadataScraperService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;

import java.time.Duration;
import java.util.List;

@Service
public class MetadataScraperServiceImpl implements MetadataScraperService {
    private static final String CACHE_KEY = "iptv:%s";

    private final WebClient genericWebClient;
    private final WebClient xmlWebClient;
    private final RedisCacheProvider cacheProvider;

    public MetadataScraperServiceImpl(WebClient genericWebClient,
                                      @Qualifier("xmlIptvWebClient")
                                      WebClient xmlIptvWebClient,
                                      RedisCacheProvider cacheProvider) {
        this.genericWebClient = genericWebClient;
        this.xmlWebClient = xmlIptvWebClient;
        this.cacheProvider = cacheProvider;

        this.preWarmCache();
    }

    @Override
    public Mono<IPTVResponse> scrape(String countryCode) {
        return this.readFromCache(countryCode)
                .switchIfEmpty(this.scrapeAllHungarianSources()) // TODO
                .zipWith(Mono.just(countryCode))
                .flatMap(this::writeToCache);
    }

    private Mono<IPTVResponse> readFromCache(String countryCode) {
        return this.cacheProvider
                .getIptvResponseCache()
                .get(String.format(CACHE_KEY, countryCode));
    }

    private Mono<IPTVResponse> scrapeFromExternalSource(String countryCode) {
        return countryCode.equals("hu") ? this.scrapeAllHungarianSources() : this.genericWebClient
                .get()
                .uri(String.format("https://iptv-org.github.io/epg/guides/%s.json", countryCode))
                .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class));
    }

    private Mono<IPTVResponse> writeToCache(Tuple2<IPTVResponse, String> iptvResponseAndCountryCode) {
        return this.cacheProvider
                .getIptvResponseCache()
                .set(String.format(
                        CACHE_KEY, iptvResponseAndCountryCode.getT2()),
                        iptvResponseAndCountryCode.getT1(),
                        Duration.ofDays(1))
                .thenReturn(iptvResponseAndCountryCode.getT1());
    }

    @Async
    // TODO: @Scheduled(cron = "* 0 3 * * *")
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
                this.xmlWebClient
                        .get()
                        .uri("https://iptv-org.github.io/epg/guides/hu/m.tv.sms.cz.xml")
                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class)),
                this.xmlWebClient
                        .get()
                        .uri("https://iptv-org.github.io/epg/guides/hu/mediaklikk.hu.xml")
                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class)),
                this.xmlWebClient
                        .get()
                        .uri("https://iptv-org.github.io/epg/guides/hu/mujtvprogram.cz.xml")
                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class)),
                this.xmlWebClient
                        .get()
                        .uri("https://iptv-org.github.io/epg/guides/hu/musor.tv.xml")
                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class)),
//                this.xmlWebClient
//                        .get()
//                        .uri("https://iptv-org.github.io/epg/guides/hu/tv.blue.ch.xml")
//                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class)),
                this.xmlWebClient
                        .get()
                        .uri("https://iptv-org.github.io/epg/guides/hu/tv.yettel.hu.xml")
                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class)),
                this.xmlWebClient
                        .get()
                        .uri("https://iptv-org.github.io/epg/guides/hu/tvmusor.hu.xml")
                        .exchangeToMono(response -> response.bodyToMono(IPTVResponse.class))
        )
                .flatMap(response -> response)
                .collectList()
                .flatMap(this::mergeResponses);
    }

    private Mono<IPTVResponse> mergeResponses(List<IPTVResponse> responses) {
        return Mono.fromCallable(() -> {
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
