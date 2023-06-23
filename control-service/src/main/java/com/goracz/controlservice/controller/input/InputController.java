package com.goracz.controlservice.controller.input;

import com.goracz.controlservice.service.InputService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RestController;

@RestController("/api/v1/input")
@RequiredArgsConstructor
public class InputController {
    private final InputService inputService;
}
