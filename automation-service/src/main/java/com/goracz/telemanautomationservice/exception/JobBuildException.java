package com.goracz.telemanautomationservice.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class JobBuildException extends RuntimeException {
    public JobBuildException(String message) {
        super(message);
    }
}
