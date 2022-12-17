package com.goracz.telemanautomationservice;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.goracz.telemanautomationservice.entity.AutomationRule;
import com.goracz.telemanautomationservice.model.AutomationRules;
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
import reactor.core.publisher.Flux;

@SpringBootApplication
@EnableReactiveMongoRepositories
public class TelemanAutomationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TelemanAutomationServiceApplication.class, args);
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

	@Bean
	public ReactiveRedisTemplate<String, AutomationRules> reactiveAutomationRuleRedisTemplate(
			ReactiveRedisConnectionFactory factory) {
		final StringRedisSerializer keySerializer = new StringRedisSerializer();
		final Jackson2JsonRedisSerializer<AutomationRules> valueSerializer = new Jackson2JsonRedisSerializer<>(
				AutomationRules.class);
		final RedisSerializationContext.RedisSerializationContextBuilder<String, AutomationRules> builder = RedisSerializationContext
				.newSerializationContext(keySerializer);
		final RedisSerializationContext<String, AutomationRules> context = builder.value(valueSerializer).build();

		return new ReactiveRedisTemplate<>(factory, context);
	}
}
