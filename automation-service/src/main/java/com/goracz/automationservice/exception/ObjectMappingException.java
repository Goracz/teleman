package com.goracz.automationservice.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ObjectMappingException extends RuntimeException {
    public ObjectMappingException(String message) {
        super(message);
    }
}
