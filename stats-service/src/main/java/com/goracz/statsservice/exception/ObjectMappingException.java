package com.goracz.statsservice.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ObjectMappingException extends RuntimeException {
    public ObjectMappingException(String message) {
        super(message);
    }
}
