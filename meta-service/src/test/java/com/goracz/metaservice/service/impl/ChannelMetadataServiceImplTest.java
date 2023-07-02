package com.goracz.metaservice.service.impl;

import com.goracz.metaservice.component.RedisCacheProvider;
import com.goracz.metaservice.entity.ChannelCategory;
import com.goracz.metaservice.entity.ChannelMetadata;
import com.goracz.metaservice.repository.ReactiveSortingChannelMetadataRepository;

import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.reactivestreams.Publisher;
import org.springframework.boot.test.context.SpringBootTest;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.List;

@SpringBootTest
@Disabled
class ChannelMetadataServiceImplTest {
    @InjectMocks
    private ChannelMetadataServiceImpl channelMetadataService;
    @InjectMocks
    private RedisCacheProvider redisCacheProvider;
    @Mock
    private ReactiveSortingChannelMetadataRepository channelMetadataRepository;

    @BeforeEach
    void setUp() {
    }

    @AfterEach
    void tearDown() {
        StepVerifier.create(channelMetadataRepository.deleteAll())
                .verifyComplete();
    }

    @Test
    void contextLoads() {
        StepVerifier.create(Mono.just(this.channelMetadataRepository))
                .assertNext(Assertions::assertNotNull)
                .verifyComplete();
    }

    @Test
    void shouldAddChannelMetadataEntry() {
        final ChannelMetadata channelMetadata = ChannelMetadata
                .builder()
                .channelName("test")
                .channelCategory(ChannelCategory.OTHER)
                .channelLogoUrl("https://example.com")
                .channelNameAliases(List.of("test SD", "test HD"))
                .build();

        Mockito.when(channelMetadataRepository.save(channelMetadata)).thenReturn(Mono.just(channelMetadata));
        final Publisher<ChannelMetadata> setup = this.channelMetadataService.add(channelMetadata);
        final Mono<ChannelMetadata> find = this.channelMetadataService
                .getByChannelName(channelMetadata.getChannelName());
        final Publisher<ChannelMetadata> composite = Mono
                .from(setup)
                .then(find);

        StepVerifier.create(composite)
                .consumeNextWith(metadata -> {
                    Assertions.assertEquals(channelMetadata.getChannelName(), metadata.getChannelName());
                    Assertions.assertEquals(channelMetadata.getChannelCategory(), metadata.getChannelCategory());
                    Assertions.assertEquals(channelMetadata.getChannelLogoUrl(), metadata.getChannelLogoUrl());
                    Assertions.assertEquals(channelMetadata.getChannelNameAliases(), metadata.getChannelNameAliases());
                })
                .verifyComplete();
    }

    @Test
    void getAll() {
    }

    @Test
    void getById() {
    }

    @Test
    void getByChannelName() {
    }

    @Test
    void delete() {
    }

    @Test
    void deleteById() {
    }

    @Test
    void deleteByChannelName() {
    }

    @Test
    void populate() {
    }
}