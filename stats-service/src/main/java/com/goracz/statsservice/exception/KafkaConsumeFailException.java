package com.goracz.statsservice.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class KafkaConsumeFailException extends RuntimeException {
    public KafkaConsumeFailException(String message) {
        super(message);
    }
}
