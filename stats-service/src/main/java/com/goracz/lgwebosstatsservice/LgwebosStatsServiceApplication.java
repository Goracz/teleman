package com.goracz.lgwebosstatsservice;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.goracz.lgwebosstatsservice.entity.ChannelHistory;
import com.goracz.lgwebosstatsservice.entity.UptimeLog;
import com.goracz.lgwebosstatsservice.model.response.CurrentTvChannelResponse;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
@EnableReactiveMongoRepositories
public class LgwebosStatsServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(LgwebosStatsServiceApplication.class, args);
	}

	@Bean
	@Primary
	public ObjectMapper primaryObjectMapper() {
		return JsonMapper
				.builder()
				.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
				.addModule(new JavaTimeModule())
				.build();
	}

	@Bean
	public MongoClient mongoClient() {
		return MongoClients.create();
	}

	@Bean
	protected String getDatabaseName() {
		return "reactive";
	}

	@Bean
	@Primary
	public ReactiveRedisConnectionFactory reactiveRedisConnectionFactory() {
		return new LettuceConnectionFactory("127.0.0.1", 6379);
	}

	@Bean
	public WebClient webClient() {
		return WebClient.builder().build();
	}

	// TODO: Refactor
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
	public ReactiveRedisTemplate<String, ChannelHistory> reactiveChannelHistoryRedisTemplate(
			ReactiveRedisConnectionFactory factory) {
		final StringRedisSerializer keySerializer = new StringRedisSerializer();
		final Jackson2JsonRedisSerializer<ChannelHistory> valueSerializer = new Jackson2JsonRedisSerializer<>(
				ChannelHistory.class);
		valueSerializer.setObjectMapper(JsonMapper
				.builder()
				.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
				.addModule(new JavaTimeModule())
				.build());
		final RedisSerializationContext.RedisSerializationContextBuilder<String, ChannelHistory> builder = RedisSerializationContext
				.newSerializationContext(keySerializer);
		final RedisSerializationContext<String, ChannelHistory> context = builder.value(valueSerializer)
				.build();

		return new ReactiveRedisTemplate<>(factory, context);
	}

	@Bean
	public ReactiveRedisTemplate<String, UptimeLog> reactiveUptimeLogRedisTemplate(
			ReactiveRedisConnectionFactory factory) {
		final StringRedisSerializer keySerializer = new StringRedisSerializer();
		final Jackson2JsonRedisSerializer<UptimeLog> valueSerializer = new Jackson2JsonRedisSerializer<>(
				UptimeLog.class);
		valueSerializer.setObjectMapper(JsonMapper
				.builder()
				.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
				.addModule(new JavaTimeModule())
				.build());
		final RedisSerializationContext.RedisSerializationContextBuilder<String, UptimeLog> builder = RedisSerializationContext
				.newSerializationContext(keySerializer);
		final RedisSerializationContext<String, UptimeLog> context = builder.value(valueSerializer)
				.build();

		return new ReactiveRedisTemplate<>(factory, context);
	}

}
