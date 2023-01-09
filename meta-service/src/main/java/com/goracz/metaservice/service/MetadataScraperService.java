package com.goracz.metaservice.service;

import com.goracz.metaservice.dto.IPTVResponse;
import reactor.core.publisher.Mono;

public interface MetadataScraperService {
    /**
     * Gets all available IPTV channel metadata for a given country's available channels.
     * @param countryCode Country code of the country to get the channels' metadata for.
     * @return Channel metadata and EGP data for the given country's available channels.
     */
    Mono<IPTVResponse> scrape(String countryCode);

    /**
     * Pre-warms the cache with the given country's available channels' metadata.
     */
    void preWarmCache();
}
