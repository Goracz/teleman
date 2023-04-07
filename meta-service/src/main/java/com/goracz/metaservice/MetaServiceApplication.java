package com.goracz.metaservice;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.goracz.metaservice.decoder.XmlDecoder;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

import java.time.Duration;

@SpringBootApplication
public class MetaServiceApplication {
	@Value("${spring.data.mongodb.uri}")
	private String mongoConnectionString;
	@Value("${spring.redis.host}")
	private String redisHost;
	@Value("${spring.redis.port}")
	private int redisPort;
	@Value("${spring.redis.password}")
	private String redisPassword;

	public static void main(String[] args) {
		SpringApplication.run(MetaServiceApplication.class, args);
	}

	@Bean(name = "webClient")
	@Primary
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

	@Bean(name = "xmlIptvWebClient")
	public WebClient xmlIptvWebClient() {
		final int maxBufferSize = 16 * 1024 * 1024;

		final XmlDecoder xmlDecoder = new XmlDecoder();
		xmlDecoder.setMaxInMemorySize(maxBufferSize);

		ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
				.codecs(configurer -> configurer.customCodecs().register(xmlDecoder))
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
}
