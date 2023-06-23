package com.goracz.automationservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.ZonedDateTime;

@Document
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AutomationAction implements Serializable {
    @Id
    private String id;
    private int priority;
    private AutomationActionType type;
    private String appId;
    private String channelId;
    private int volume;
    @CreatedDate
    private ZonedDateTime createdAt;
    @LastModifiedDate
    private ZonedDateTime updatedAt;
}
