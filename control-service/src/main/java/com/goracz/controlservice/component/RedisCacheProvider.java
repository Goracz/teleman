package com.goracz.controlservice.component;

import com.goracz.controlservice.model.response.*;

import lombok.Getter;

import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.data.redis.serializer.*;
import org.springframework.stereotype.Component;

@Component
@Getter
public class RedisCacheProvider {
    private final ReactiveValueOperations<String, GetVolumeResponse> volumeResponseCache;
    private final ReactiveValueOperations<String, TvChannelListResponse> tvChannelListResponseCache;
    private final ReactiveValueOperations<String, CurrentTvChannelResponse> currentTvChannelCache;
    private final ReactiveValueOperations<String, SoftwareInformationResponse> softwareInformationResponseCache;
    private final ReactiveValueOperations<String, PowerStateResponse> powerStateResponseCache;
    private final ReactiveValueOperations<String, ServiceDescription> serviceDescriptionCache;
    private final ReactiveValueOperations<String, ApplicationListResponse> applicationListCache;
    private final ReactiveValueOperations<String, LaunchPointsResponse> launchPointsCache;
    private final ReactiveValueOperations<String, ForegroundAppChangeResponse> foregroundAppCache;
    private final ReactiveValueOperations<String, byte[]> launchPointImageCache;

    public RedisCacheProvider(final ReactiveRedisConnectionFactory factory) {
        this.volumeResponseCache = this.reactiveVolumeResponseRedisTemplate(factory).opsForValue();
        this.tvChannelListResponseCache = this.reactiveTvChannelListResponseRedisTemplate(factory).opsForValue();
        this.currentTvChannelCache = this.reactiveCurrentTvChannelResponseRedisTemplate(factory).opsForValue();
        this.softwareInformationResponseCache = this.reactiveSoftwareInformationResponseRedisTemplate(factory).opsForValue();
        this.powerStateResponseCache = this.reactivePowerStateResponseRedisTemplate(factory).opsForValue();
        this.serviceDescriptionCache = this.reactiveServiceDescriptionRedisTemplate(factory).opsForValue();
        this.applicationListCache = this.reactiveApplicationListRedisTemplate(factory).opsForValue();
        this.launchPointsCache = this.reactiveLaunchPointsRedisTemplate(factory).opsForValue();
        this.foregroundAppCache = this.reactiveForegroundAppRedisTemplate(factory).opsForValue();
        this.launchPointImageCache = this.reactiveLaunchPointImageCache(factory).opsForValue();
    }

    private ReactiveRedisTemplate<String, GetVolumeResponse> reactiveVolumeResponseRedisTemplate(
            final ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<GetVolumeResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                GetVolumeResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, GetVolumeResponse> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, GetVolumeResponse> context = builder.value(valueSerializer).build();

        return new ReactiveRedisTemplate<>(factory, context);
    }
    
    private ReactiveRedisTemplate<String, TvChannelListResponse> reactiveTvChannelListResponseRedisTemplate(
            final ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<TvChannelListResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                TvChannelListResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, TvChannelListResponse> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, TvChannelListResponse> context = builder.value(valueSerializer).build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    private ReactiveRedisTemplate<String, CurrentTvChannelResponse> reactiveCurrentTvChannelResponseRedisTemplate(
            final ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<CurrentTvChannelResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                CurrentTvChannelResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, CurrentTvChannelResponse> builder = 
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, CurrentTvChannelResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    private ReactiveRedisTemplate<String, SoftwareInformationResponse> reactiveSoftwareInformationResponseRedisTemplate(
            final ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<SoftwareInformationResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                SoftwareInformationResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, SoftwareInformationResponse> builder = 
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, SoftwareInformationResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    private ReactiveRedisTemplate<String, ServiceDescription> reactiveServiceDescriptionRedisTemplate(
            final ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<ServiceDescription> valueSerializer = new Jackson2JsonRedisSerializer<>(
                ServiceDescription.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, ServiceDescription> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, ServiceDescription> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    private ReactiveRedisTemplate<String, PowerStateResponse> reactivePowerStateResponseRedisTemplate(
            final ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<PowerStateResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                PowerStateResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, PowerStateResponse> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, PowerStateResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    private ReactiveRedisTemplate<String, ApplicationListResponse> reactiveApplicationListRedisTemplate(
            final ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<ApplicationListResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                ApplicationListResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, ApplicationListResponse> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, ApplicationListResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    private ReactiveRedisTemplate<String, LaunchPointsResponse> reactiveLaunchPointsRedisTemplate(
            final ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<LaunchPointsResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                LaunchPointsResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, LaunchPointsResponse> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, LaunchPointsResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    private ReactiveRedisTemplate<String, ForegroundAppChangeResponse> reactiveForegroundAppRedisTemplate(
            final ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<ForegroundAppChangeResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                ForegroundAppChangeResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, ForegroundAppChangeResponse> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, ForegroundAppChangeResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    private ReactiveRedisTemplate<String, byte[]> reactiveLaunchPointImageCache(
            final ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final RedisSerializer<byte[]> valueSerializer = new RedisSerializer<>() {
            @Override
            public byte[] serialize(final byte[] bytes) throws SerializationException {
                return bytes;
            }

            @Override
            public byte[] deserialize(final byte[] bytes) throws SerializationException {
                return bytes;
            }
        };
        final RedisSerializationContext.RedisSerializationContextBuilder<String, byte[]> builder =
                RedisSerializationContext.newSerializationContext(keySerializer);
        final RedisSerializationContext<String, byte[]> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }
}
