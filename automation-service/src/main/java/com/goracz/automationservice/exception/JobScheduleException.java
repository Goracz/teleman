package com.goracz.automationservice.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class JobScheduleException extends RuntimeException {
    public JobScheduleException(String message) {
        super(message);
    }
}
