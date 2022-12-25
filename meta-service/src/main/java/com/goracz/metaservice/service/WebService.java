package com.goracz.metaservice.service;

import lombok.Getter;

/**
 * Service that communicates via a network protocol
 */
@Getter
public abstract class WebService {
    /**
     * Number of tries to re-send the HTTP request in case of failure
     */
    protected int retriesCount = 3;
}
