package com.goracz.automationservice;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Disabled
class AutomationServiceApplicationTests {
    @Test
    void contextLoads() {
        Assertions.assertTrue(true);
    }
}
