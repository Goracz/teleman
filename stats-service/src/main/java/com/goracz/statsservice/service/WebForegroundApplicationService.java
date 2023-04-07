package com.goracz.statsservice.service;

import com.goracz.statsservice.model.response.ForegroundAppChangeResponse;
import reactor.core.publisher.Mono;

public interface WebForegroundApplicationService {
    Mono<ForegroundAppChangeResponse> getForegroundApplication();
}
