package com.goracz.metaservice.service.impl;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Disabled
class MetaServiceApplicationTests {
	@Test
	void contextLoads() {
		Assertions.assertTrue(true);
	}
}
