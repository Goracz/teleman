package com.goracz.automationservice.service;

import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Optional;

/**
 * Cache manager is an abstraction of managing the cache.
 * @param <T> Type of objects that are managed in cache
 * @param <R> Key of objects that are managed in cache
 */
public interface CacheManager<T, R> {
    /**
     * Reads an entity from cache
     * @param key Key of the entity to read
     * @return Requested entity
     */
    Mono<Optional<T>> read(R key);

    /**
     * Writes an entity to cache without TTL
     * @param entity Entity to persist in cache
     * @param key Key of the object in cache
     * @return Persisted entity
     */
    Mono<Optional<T>> write(T entity, R key);

    /**
     * Writes an entity to cache with TTL
     * @param entity Entity to persist in cache
     * @param key Key of the object in cache
     * @param ttl TTL of the object in cache
     * @return Persisted entity
     */
    Mono<Optional<T>> write(T entity, R key, Duration ttl);
}
