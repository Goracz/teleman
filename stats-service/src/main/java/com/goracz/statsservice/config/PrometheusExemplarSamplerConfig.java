package com.goracz.statsservice.config;

import io.prometheus.client.exemplars.tracer.otel_agent.OpenTelemetryAgentSpanContextSupplier;

import org.springframework.context.annotation.Bean;

// @Configuration
public class PrometheusExemplarSamplerConfig {
    @Bean
    public OpenTelemetryAgentSpanContextSupplier openTelemetryAgentSpanContextSupplier() {
        return new OpenTelemetryAgentSpanContextSupplier();
    }
}
