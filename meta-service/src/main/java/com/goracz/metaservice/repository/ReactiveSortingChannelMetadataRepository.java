package com.goracz.metaservice.repository;

import com.goracz.metaservice.entity.ChannelMetadata;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface ReactiveSortingChannelMetadataRepository extends ReactiveMongoRepository<ChannelMetadata, String> {
    Mono<ChannelMetadata> findByChannelName(String channelName);
    Mono<ChannelMetadata> findByChannelNameLike(String channelName);
    Mono<ChannelMetadata> deleteByChannelName(String channelName);
}
