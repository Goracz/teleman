package com.goracz.controlservice.service.impl;

import com.goracz.controlservice.service.InputService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class InputServiceImpl implements InputService {
    private final WebClient webClient;
}
