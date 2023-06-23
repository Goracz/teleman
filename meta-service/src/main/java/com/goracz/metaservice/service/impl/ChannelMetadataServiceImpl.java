package com.goracz.metaservice.service.impl;

import com.goracz.metaservice.component.RedisCacheProvider;
import com.goracz.metaservice.entity.ChannelMetadata;
import com.goracz.metaservice.model.Channel;
import com.goracz.metaservice.model.response.PopulateChannelsResponse;
import com.goracz.metaservice.repository.ReactiveSortingChannelMetadataRepository;
import com.goracz.metaservice.service.ChannelMetadataService;

import org.springframework.stereotype.Service;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;
import java.util.Collection;

@Service
public class ChannelMetadataServiceImpl implements ChannelMetadataService {
    private final RedisCacheProvider cacheProvider;
    private final ReactiveSortingChannelMetadataRepository channelMetadataRepository;

    public ChannelMetadataServiceImpl(RedisCacheProvider cacheProvider,
                                      ReactiveSortingChannelMetadataRepository channelMetadataRepository) {
        this.cacheProvider = cacheProvider;
        this.channelMetadataRepository = channelMetadataRepository;
    }

    @Override
    public Mono<ChannelMetadata> add(ChannelMetadata channelMetadata) {
        return this.channelMetadataRepository
                .save(channelMetadata)
                .flatMap(this::writeToCache);
    }

    /**
     * @implNote This method always returns data directly from the database and does never use Redis.
     */
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
                .switchIfEmpty(this.searchInDatabase(channelName))
                .switchIfEmpty(ChannelMetadata.withChannelName(channelName))
                .flatMap(this::writeToCache);
    }

    private Mono<ChannelMetadata> searchInDatabase(String channelName) {
        return this.channelMetadataRepository
                .findByChannelName(channelName)
                .switchIfEmpty(this.channelMetadataRepository.findByChannelNameLike(channelName));
    }

    private Mono<ChannelMetadata> writeToCache(ChannelMetadata metadata) {
        return this.cacheProvider
                .getChannelMetadataCache()
                .set(metadata.getChannelName(), metadata)
                .map(result -> metadata);
    }

    @Override
    public Mono<ChannelMetadata> delete(ChannelMetadata channelMetadata) {
        return this.channelMetadataRepository
                .delete(channelMetadata)
                .map(result -> channelMetadata)
                .flatMap(this::removeFromCache);
    }

    @Override
    public Mono<ChannelMetadata> deleteById(String id) {
        return this.channelMetadataRepository
                .findById(id)
                .flatMap(this::deleteFromDatabase)
                .flatMap(this::removeFromCache);
    }

    private Mono<ChannelMetadata> removeFromCache(ChannelMetadata metadata) {
        return this.cacheProvider
                .getChannelMetadataCache()
                .getAndDelete(metadata.getChannelName());
    }

    private Mono<ChannelMetadata> deleteFromDatabase(ChannelMetadata metadata) {
        return this.channelMetadataRepository
                .delete(metadata)
                .map(result -> metadata);
    }

    @Override
    public Mono<ChannelMetadata> deleteByChannelName(String channelName) {
        return this.channelMetadataRepository
                .deleteByChannelName(channelName)
                .map(result -> channelName)
                .flatMap(this::removeFromCache);
    }

    private Mono<ChannelMetadata> removeFromCache(String channelName) {
        return this.cacheProvider
                .getChannelMetadataCache()
                .getAndDelete(channelName);
    }

    @Override
    public Mono<PopulateChannelsResponse> populate(Collection<Channel> channels) {
        return Flux.fromIterable(channels)
                .flatMap(channel -> this.cacheProvider
                        .getChannelMetadataCache()
                        .get(channel.getChannelName())
                        .switchIfEmpty(this.searchInDatabase(channel.getChannelName()))
                        .flatMap(this::writeToCache)
                        .flatMap(channel::populateChannelLogo)
                        .subscribeOn(Schedulers.boundedElastic()), Runtime.getRuntime().availableProcessors())
                .delayElements(Duration.ofMillis(1))
                .collectList()
                .map(populatedChannels -> PopulateChannelsResponse.builder()
                        .channels(populatedChannels)
                        .build());
    }
}
