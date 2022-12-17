package com.goracz.lgwebostvmetaservice.service.impl;

import com.goracz.lgwebostvmetaservice.entity.ChannelMetadata;
import com.goracz.lgwebostvmetaservice.repository.ReactiveSortingChannelMetadataRepository;
import com.goracz.lgwebostvmetaservice.service.ChannelMetadataService;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
public class ChannelMetadataServiceImpl implements ChannelMetadataService {
    private static final int CACHE_WRITE_TRIES = 3;

    private final ReactiveValueOperations<String, ChannelMetadata> channelMetadataReactiveValueOps;
    private final ReactiveSortingChannelMetadataRepository channelMetadataRepository;

    public ChannelMetadataServiceImpl(ReactiveRedisTemplate<String, ChannelMetadata> channelMetadataReactiveRedisTemplate,
                                      ReactiveSortingChannelMetadataRepository channelMetadataRepository) {
        this.channelMetadataReactiveValueOps = channelMetadataReactiveRedisTemplate.opsForValue();
        this.channelMetadataRepository = channelMetadataRepository;
    }

    @Override
    public Mono<ChannelMetadata> add(ChannelMetadata channelMetadata) {
        return this.channelMetadataRepository.save(channelMetadata)
                .map(savedChannelMetadata -> {
                    this.channelMetadataReactiveValueOps
                            .set(savedChannelMetadata.getChannelName(), savedChannelMetadata)
                            .retry(CACHE_WRITE_TRIES)
                            .log()
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe();
                    return savedChannelMetadata;
                })
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
        return this.channelMetadataReactiveValueOps.get(channelName)
                .switchIfEmpty(this.channelMetadataRepository.findByChannelName(channelName))
                .switchIfEmpty(this.channelMetadataRepository.findByChannelNameLike(channelName)
                        .map(channelMetadata -> {
                            this.channelMetadataReactiveValueOps
                                    .set(channelMetadata.getChannelName(), channelMetadata)
                                    .retry(CACHE_WRITE_TRIES)
                                    .log()
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe();
                            return channelMetadata;
                        }));
    }

    @Override
    public Mono<Void> delete(ChannelMetadata channelMetadata) {
        return this.channelMetadataRepository.delete(channelMetadata).mapNotNull(aVoid -> {
            this.channelMetadataReactiveValueOps
                    .delete(channelMetadata.getChannelName())
                    .retry(CACHE_WRITE_TRIES)
                    .log()
                    .subscribeOn(Schedulers.boundedElastic())
                    .subscribe();
            return aVoid;
        });
    }

    @Override
    public Mono<Void> deleteById(String id) {
        return this.channelMetadataRepository.findById(id)
                .map(channelMetadata -> {
                    this.channelMetadataRepository
                            .deleteById(id)
                            .log()
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe();
                    return channelMetadata;
                })
                .mapNotNull(channelMetadata -> {
                    this.channelMetadataReactiveValueOps
                            .delete(channelMetadata.getChannelName())
                            .retry(CACHE_WRITE_TRIES)
                            .log()
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe();
                    return null;
                });
    }

    @Override
    public Mono<Void> deleteByChannelName(String channelName) {
        return this.channelMetadataRepository.deleteByChannelName(channelName).mapNotNull(aVoid -> {
            this.channelMetadataReactiveValueOps
                    .delete(channelName)
                    .retry(CACHE_WRITE_TRIES)
                    .log()
                    .subscribeOn(Schedulers.boundedElastic())
                    .subscribe();
            return aVoid;
        });
    }
}
