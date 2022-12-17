package com.goracz.statsservice.service.impl;

import com.goracz.statsservice.service.CacheManager;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.lang.reflect.ParameterizedType;
import java.time.Duration;

@Service
public class RedisCacheManagerImpl<K, T> implements CacheManager<K, T> {
    private final ReactiveValueOperations<K, T> cacheOperations;

    public RedisCacheManagerImpl(ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<T> valueSerializer = new Jackson2JsonRedisSerializer<>(
                this.getGenericTypeClass());
        final RedisSerializationContext.RedisSerializationContextBuilder<K, T> builder = RedisSerializationContext
                .newSerializationContext(keySerializer);
        final RedisSerializationContext<K, T> context = builder.value(valueSerializer).build();
        final ReactiveRedisTemplate<K, T> template = new ReactiveRedisTemplate<>(factory, context);

        this.cacheOperations = template.opsForValue();
    }

    @Override
    public Mono<T> read(K key) {
        return this.cacheOperations
                .get(key)
                .retry(CacheManager.CACHE_READ_TRIES);
    }

    @Override
    public Mono<T> write(K key, T entity) {
        return this.cacheOperations
                .set(key, entity)
                .retry(CacheManager.CACHE_WRITE_TRIES)
                .map(result -> entity);
    }

    @Override
    public Mono<T> write(K key, T entity, Duration ttl) {
        return this.cacheOperations
                .set(key, entity, ttl)
                .retry(CacheManager.CACHE_WRITE_TRIES)
                .map(result -> entity);
    }

    @SuppressWarnings("unchecked")
    private Class<T> getGenericTypeClass() {
        try{
            String className = ((ParameterizedType) getClass()
                    .getGenericSuperclass())
                    .getActualTypeArguments()[0]
                    .getTypeName();
            Class<?> clazz = Class.forName(className);
            return (Class<T>) clazz;
        } catch(Exception e) {
            throw new IllegalStateException("Class is not parametrized with generic type! Please use extends <>.");
        }
    }
}
