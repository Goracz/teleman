package com.goracz.controlservice.component;

import com.goracz.controlservice.model.response.*;
import lombok.Getter;
import org.springframework.context.annotation.Bean;
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
    private final ReactiveValueOperations<String, GetVolumeResponse> volumeResponseCache;
    private final ReactiveValueOperations<String, TvChannelListResponse> tvChannelListResponseCache;
    private final ReactiveValueOperations<String, CurrentTvChannelResponse> currentTvChannelCache;
    private final ReactiveValueOperations<String, SoftwareInformationResponse> softwareInformationResponseCache;
    private final ReactiveValueOperations<String, PowerStateResponse> powerStateResponseCache;

    public RedisCacheProvider(ReactiveRedisConnectionFactory factory) {
        this.volumeResponseCache = this.reactiveVolumeResponseRedisTemplate(factory).opsForValue();
        this.tvChannelListResponseCache = this.reactiveTvChannelListResponseRedisTemplate(factory).opsForValue();
        this.currentTvChannelCache = this.reactiveCurrentTvChannelResponseRedisTemplate(factory).opsForValue();
        this.softwareInformationResponseCache = this.reactiveSoftwareInformationResponseRedisTemplate(factory).opsForValue();
        this.powerStateResponseCache = this.reactivePowerStateResponseRedisTemplate(factory).opsForValue();
    }

    @Bean
    private ReactiveRedisTemplate<String, GetVolumeResponse> reactiveVolumeResponseRedisTemplate(
            ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<GetVolumeResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                GetVolumeResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, GetVolumeResponse> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, GetVolumeResponse> context = builder.value(valueSerializer).build();

        return new ReactiveRedisTemplate<>(factory, context);
    }
    
    @Bean
    private ReactiveRedisTemplate<String, TvChannelListResponse> reactiveTvChannelListResponseRedisTemplate(
            ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<TvChannelListResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                TvChannelListResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, TvChannelListResponse> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, TvChannelListResponse> context = builder.value(valueSerializer).build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    @Bean
    private ReactiveRedisTemplate<String, CurrentTvChannelResponse> reactiveCurrentTvChannelResponseRedisTemplate(
            ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<CurrentTvChannelResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                CurrentTvChannelResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, CurrentTvChannelResponse> builder = 
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, CurrentTvChannelResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    @Bean
    private ReactiveRedisTemplate<String, SoftwareInformationResponse> reactiveSoftwareInformationResponseRedisTemplate(
            ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<SoftwareInformationResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                SoftwareInformationResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, SoftwareInformationResponse> builder = 
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, SoftwareInformationResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    @Bean
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
