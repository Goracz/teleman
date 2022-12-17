package com.goracz.lgwebostvmetaservice.service;

import reactor.core.publisher.Mono;

import java.time.Duration;

/**
 * Cache manager is an abstraction of managing the cache.
 * @param <K> Key of objects that are managed in cache
 * @param <T> Type of objects that are managed in cache
 */
public interface CacheManager<K, T> {
    /**
     * The number of tries to read the given object from cache
     * in case of failure of the initial try.
     */
    int CACHE_READ_TRIES = 3;

    /**
     * The number of tries to write the given object to cache
     * in case of failure of the initial try.
     */
    int CACHE_WRITE_TRIES = 3;
    /**
     * Reads an entity from cache
     * @param key Key of the entity to read
     * @return Requested entity
     */
    Mono<T> read(K key);

    /**
     * Writes an entity to cache without TTL
     * @param entity Entity to persist in cache
     * @param key Key of the object in cache
     * @return Persisted entity
     */
    Mono<T> write(K key, T entity);

    /**
     * Writes an entity to cache with TTL
     * @param entity Entity to persist in cache
     * @param key Key of the object in cache
     * @param ttl TTL of the object in cache
     * @return Persisted entity
     */
    Mono<T> write(K key, T entity, Duration ttl);

    /**
     * Removes an entity from cache
     * @param key Key of the entity to remove
     * @return Removed entity
     */
    Mono<T> remove(K key);
}
