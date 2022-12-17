package com.goracz.lgwebostvmetaservice;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.goracz.lgwebostvmetaservice.dto.IPTVResponse;
import com.goracz.lgwebostvmetaservice.entity.ChannelMetadata;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
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
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

import java.time.Duration;

@SpringBootApplication
@EnableScheduling
public class LgwebosTvMetaServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(LgwebosTvMetaServiceApplication.class, args);
	}

	@Bean
	public WebClient webClient() {
		final int maxBufferSize = 16 * 1024 * 1024;

		final ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
				.codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(maxBufferSize))
				.build();
		final HttpClient client = HttpClient.create(ConnectionProvider.builder("teleman-http-client")
				.maxIdleTime(Duration.ofSeconds(30))
				.build());
		return WebClient.builder()
				.clientConnector(new ReactorClientHttpConnector(client))
				.exchangeStrategies(exchangeStrategies)
				.build();
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
}
