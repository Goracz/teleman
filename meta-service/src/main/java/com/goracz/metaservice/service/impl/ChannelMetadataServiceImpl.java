package com.goracz.metaservice.service.impl;

import com.goracz.metaservice.component.RedisCacheProvider;
import com.goracz.metaservice.entity.ChannelMetadata;
import com.goracz.metaservice.repository.ReactiveSortingChannelMetadataRepository;
import com.goracz.metaservice.service.ChannelMetadataService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ChannelMetadataServiceImpl implements ChannelMetadataService {
    private static final int CACHE_WRITE_TRIES = 3;

    private final ReactiveSortingChannelMetadataRepository channelMetadataRepository;
    private final RedisCacheProvider cacheProvider;

    public ChannelMetadataServiceImpl(ReactiveSortingChannelMetadataRepository channelMetadataRepository,
                                      RedisCacheProvider cacheProvider) {
        this.channelMetadataRepository = channelMetadataRepository;
        this.cacheProvider = cacheProvider;
    }

    @Override
    public Mono<ChannelMetadata> add(ChannelMetadata channelMetadata) {
        return this.channelMetadataRepository
                .save(channelMetadata)
                .flatMap(this::writeToCache);
    }

    private Mono<ChannelMetadata> writeToCache(ChannelMetadata metadata) {
        return this.cacheProvider
                .getChannelMetadataCache()
                .set(metadata.getChannelName(), metadata)
                .map(result -> metadata)
                .retry(CACHE_WRITE_TRIES)
                .log();
    }

    @Override
    public Flux<ChannelMetadata> getAll() {
        return this.channelMetadataRepository
                .findAll()
                .log();
    }

    /**
     * @implNote This method always returns data directly from the database and does never use Redis.
     */
    @Override
    public Mono<ChannelMetadata> getById(String id) {
        return this.channelMetadataRepository
                .findById(id)
                .log();
    }

    @Override
    public Mono<ChannelMetadata> getByChannelName(String channelName) {
        return this.cacheProvider
                .getChannelMetadataCache()
                .get(channelName)
                .switchIfEmpty(this.channelMetadataRepository.findByChannelName(channelName))
                .switchIfEmpty(this.channelMetadataRepository.findByChannelNameLike(channelName)
                .flatMap(this::writeToCache));
    }

    @Override
    public Mono<ChannelMetadata> delete(ChannelMetadata channelMetadata) {
        return this.channelMetadataRepository
                .delete(channelMetadata)
                .map(result -> channelMetadata)
                .flatMap(this::deleteFromCache);
    }

    private Mono<ChannelMetadata> deleteFromCache(ChannelMetadata metadata) {
        return this.cacheProvider
                .getChannelMetadataCache()
                .delete(metadata.getChannelName())
                .map(result -> metadata)
                .retry(CACHE_WRITE_TRIES)
                .log();
    }

    @Override
    public Mono<ChannelMetadata> deleteById(String id) {
        return this.channelMetadataRepository.findById(id)
                .flatMap(this::deleteFromDatabase)
                .flatMap(this::deleteFromCache);
    }

    private Mono<ChannelMetadata> deleteFromDatabase(ChannelMetadata metadata) {
        return this.channelMetadataRepository
                .delete(metadata)
                .map(result -> metadata)
                .log();
    }

    @Override
    public Mono<ChannelMetadata> deleteByChannelName(String channelName) {
        return this.channelMetadataRepository
                .deleteByChannelName(channelName)
                .flatMap(this::deleteFromCache);
    }
}
