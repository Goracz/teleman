package com.goracz.controlservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class ControlServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ControlServiceApplication.class, args);
    }

    /**
     * Provides Redis connection factory
     * @return Redis connection factory
     */
    @Bean
    @Primary
    public ReactiveRedisConnectionFactory reactiveRedisConnectionFactory() {
        return new LettuceConnectionFactory("127.0.0.1", 6379);
    }

    /**
     * Provides Web Client
     * @return Web client instance
     */
    @Bean
    public WebClient webClient() {
        return WebClient
                .builder()
                .baseUrl("http://127.0.0.1:5000/api/v1")
                .build();
    }
}
