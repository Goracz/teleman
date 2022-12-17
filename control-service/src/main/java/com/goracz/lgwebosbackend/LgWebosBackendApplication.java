package com.goracz.lgwebosbackend;

import com.goracz.lgwebosbackend.model.response.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class LgWebosBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(LgWebosBackendApplication.class, args);
    }

    @Bean
    @Primary
    public ReactiveRedisConnectionFactory reactiveRedisConnectionFactory() {
        return new LettuceConnectionFactory("127.0.0.1", 6379);
    }

    // TODO: Refactor
    @Bean
    public ReactiveRedisTemplate<String, GetVolumeResponse> reactiveRedisTemplate(
            ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<GetVolumeResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                GetVolumeResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, GetVolumeResponse> builder = RedisSerializationContext
                .newSerializationContext(keySerializer);
        final RedisSerializationContext<String, GetVolumeResponse> context = builder.value(valueSerializer).build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    @Bean
    public ReactiveRedisTemplate<String, TvChannelListResponse> reactiveTvChannelListResponseRedisTemplate(
            ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<TvChannelListResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                TvChannelListResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, TvChannelListResponse> builder = RedisSerializationContext
                .newSerializationContext(keySerializer);
        final RedisSerializationContext<String, TvChannelListResponse> context = builder.value(valueSerializer).build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    @Bean
    public ReactiveRedisTemplate<String, CurrentTvChannelResponse> reactiveCurrentTvChannelResponseRedisTemplate(
            ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<CurrentTvChannelResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                CurrentTvChannelResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, CurrentTvChannelResponse> builder = RedisSerializationContext
                .newSerializationContext(keySerializer);
        final RedisSerializationContext<String, CurrentTvChannelResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    @Bean
    public ReactiveRedisTemplate<String, SoftwareInformationResponse> reactiveSoftwareInformationResponseRedisTemplate(
            ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<SoftwareInformationResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                SoftwareInformationResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, SoftwareInformationResponse> builder = RedisSerializationContext
                .newSerializationContext(keySerializer);
        final RedisSerializationContext<String, SoftwareInformationResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    @Bean
    public ReactiveRedisTemplate<String, PowerStateResponse> reactivePowerStateResponseRedisTemplate(
            ReactiveRedisConnectionFactory factory) {
        final StringRedisSerializer keySerializer = new StringRedisSerializer();
        final Jackson2JsonRedisSerializer<PowerStateResponse> valueSerializer = new Jackson2JsonRedisSerializer<>(
                PowerStateResponse.class);
        final RedisSerializationContext.RedisSerializationContextBuilder<String, PowerStateResponse> builder = RedisSerializationContext
                .newSerializationContext(keySerializer);
        final RedisSerializationContext<String, PowerStateResponse> context = builder.value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }

    @Bean
    public WebClient webClient() {
        return WebClient.create("http://127.0.0.1:5000/api/v1");
    }

}
