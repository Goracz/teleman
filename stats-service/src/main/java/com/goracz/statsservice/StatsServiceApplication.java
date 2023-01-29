package com.goracz.statsservice;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
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
	public static void main(String[] args) {
		SpringApplication.run(StatsServiceApplication.class, args);
	}

	@Value("${spring.data.mongodb.uri}")
	private String mongoConnectionString;

	@Value("${spring.redis.host}")
	private String redisHost;
	@Value("${spring.redis.port}")
	private int redisPort;
	@Value("${spring.redis.password}")
	private String redisPassword;

	@Bean
	@Primary
	public ObjectMapper primaryObjectMapper() {
		return JsonMapper
				.builder()
				.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
				.findAndAddModules()
				.build();
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
