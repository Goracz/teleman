package com.goracz.statsservice.component;

import com.goracz.statsservice.entity.ChannelHistory;
import com.goracz.statsservice.entity.UptimeLog;
import com.goracz.statsservice.model.response.PowerStateResponse;
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
    private final ReactiveValueOperations<String, ChannelHistory> channelHistoryCache;
    private final ReactiveValueOperations<String, UptimeLog> uptimeLogCache;
    private final ReactiveValueOperations<String, PowerStateResponse> powerStateResponseCache;

    public RedisCacheProvider(ReactiveRedisConnectionFactory factory) {
        this.factory = factory;
        this.channelHistoryCache = this.channelHistoryReactiveRedisTemplate().opsForValue();
        this.uptimeLogCache = this.uptimeLogReactiveRedisTemplate().opsForValue();
        this.powerStateResponseCache = this.reactivePowerStateResponseRedisTemplate(factory).opsForValue();
    }

    private ReactiveRedisTemplate<String, ChannelHistory> channelHistoryReactiveRedisTemplate() {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<ChannelHistory> valueSerializer = new Jackson2JsonRedisSerializer<>(
                ChannelHistory.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, ChannelHistory> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, ChannelHistory> context = builder.value(valueSerializer).build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    private ReactiveRedisTemplate<String, UptimeLog> uptimeLogReactiveRedisTemplate() {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<UptimeLog> valueSerializer = new Jackson2JsonRedisSerializer<>(
                UptimeLog.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, UptimeLog> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, UptimeLog> context = builder.value(valueSerializer).build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    private ReactiveRedisTemplate<String, PowerStateResponse> reactivePowerStateResponseRedisTemplate(
            ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<PowerStateResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                PowerStateResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, PowerStateResponse> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, PowerStateResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }
}
