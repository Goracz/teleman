package com.goracz.statsservice.config;

import com.goracz.statsservice.util.ZonedDateTimeReadConverter;
import com.goracz.statsservice.util.ZonedDateTimeWriteConverter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class MongoCustomConversionsConfig {
    private final List<Converter<?, ?>> converters = new ArrayList<>();

    @Bean
    public MongoCustomConversions customConversions() {
        converters.add(new ZonedDateTimeReadConverter());
        converters.add(new ZonedDateTimeWriteConverter());

        return new MongoCustomConversions(converters);
    }
}
