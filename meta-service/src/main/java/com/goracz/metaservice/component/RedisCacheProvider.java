package com.goracz.metaservice.component;

import com.goracz.metaservice.dto.IPTVResponse;
import com.goracz.metaservice.entity.ChannelMetadata;

import lombok.Getter;

import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Component;

@Component
@Getter
public class RedisCacheProvider {
    private final ReactiveRedisConnectionFactory factory;
    private final ReactiveValueOperations<String, ChannelMetadata> channelMetadataCache;
    private final ReactiveValueOperations<String, IPTVResponse> iptvResponseCache;

    public RedisCacheProvider(ReactiveRedisConnectionFactory factory) {
        this.factory = factory;

        this.channelMetadataCache = this.channelMetadataReactiveRedisTemplate().opsForValue();
        this.iptvResponseCache = this.iptvResponseReactiveRedisTemplate().opsForValue();
    }

    private ReactiveRedisTemplate<String, ChannelMetadata> channelMetadataReactiveRedisTemplate() {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<ChannelMetadata> valueSerializer = new Jackson2JsonRedisSerializer<>(
                ChannelMetadata.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, ChannelMetadata> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, ChannelMetadata> context = builder.value(valueSerializer).build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    private ReactiveRedisTemplate<String, IPTVResponse> iptvResponseReactiveRedisTemplate() {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<IPTVResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                IPTVResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, IPTVResponse> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, IPTVResponse> context = builder.value(valueSerializer).build();

        return new ReactiveRedisTemplate<>(factory, context);
    }
}
