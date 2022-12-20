package com.goracz.automationservice.service.impl;

import com.goracz.automationservice.service.CacheManager;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.TypeVariable;
import java.time.Duration;
import java.util.Optional;

@Service
public class RedisCacheManagerImpl<T, K> implements CacheManager<T, K> {
    private final ReactiveValueOperations<K, T> cacheOperations;

    public RedisCacheManagerImpl(ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<T> valueSerializer = new Jackson2JsonRedisSerializer<>(
                this.getGenericClass());
        final RedisSerializationContext.RedisSerializationContextBuilder<K, T> builder = RedisSerializationContext
                .newSerializationContext(keySerializer);
        final RedisSerializationContext<K, T> context = builder.value(valueSerializer).build();
        final ReactiveRedisTemplate<K, T> template = new ReactiveRedisTemplate<>(factory, context);

        this.cacheOperations = template.opsForValue();
    }

    @Override
    public Mono<Optional<T>> read(K key) {
        return this.cacheOperations
                .get(key)
                .map(Optional::of);
    }

    @Override
    public Mono<Optional<T>> write(T entity, K key) {
        return this.cacheOperations
                .set(key, entity)
                .map(result -> {
                    if (Boolean.TRUE.equals(result)) return Optional.of(entity);
                    return Optional.empty();
                });
    }

    @Override
    public Mono<Optional<T>> write(T entity, K key, Duration ttl) {
        return this.cacheOperations
                .set(key, entity, ttl)
                .map(result -> {
                    if (Boolean.TRUE.equals(result)) return Optional.of(entity);
                    return Optional.empty();
                });
    }

    @SuppressWarnings("unchecked")
    public <T> Class<T> getGenericClass() {
        final __<T> instance = new __<>();
        final TypeVariable<?>[] parameters = instance.getClass().getTypeParameters();

        return (Class<T>) parameters[0].getClass();
    }

    private final class __<T> {
        private __() { }
    }
}
