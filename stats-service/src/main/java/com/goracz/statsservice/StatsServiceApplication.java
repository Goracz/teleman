package com.goracz.statsservice;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
@EnableReactiveMongoRepositories
public class StatsServiceApplication {
	@Value("${spring.data.mongodb.uri}")
	private String mongoConnectionString;
	@Value("${spring.redis.host}")
	private String redisHost;
	@Value("${spring.redis.port}")
	private int redisPort;
	@Value("${spring.redis.password}")
	private String redisPassword;

	public static void main(String[] args) {
		SpringApplication.run(StatsServiceApplication.class, args);
	}

	@Bean
	@Primary
	public ObjectMapper primaryObjectMapper() {
		final ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		return objectMapper;
	}

	@Bean
	public MongoClient mongoClient() {
		return MongoClients.create(this.mongoConnectionString);
	}

	@Bean
	@Primary
	public ReactiveRedisConnectionFactory reactiveRedisConnectionFactory() {
		final RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
		configuration.setHostName(this.redisHost);
		configuration.setPort(this.redisPort);
		configuration.setPassword(this.redisPassword);

		return new LettuceConnectionFactory(configuration);
	}

	@Bean
	public WebClient webClient() {
		return WebClient.builder().build();
	}
}
