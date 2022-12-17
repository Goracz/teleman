package com.goracz.statsservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.domain.Persistable;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.ZonedDateTime;

@Document
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UptimeLog implements Serializable, Persistable<String> {
    @Id
    private String id;
    private ZonedDateTime turnOnTime;
    private ZonedDateTime turnOffTime;
    @CreatedDate
    private ZonedDateTime createdAt;
    @LastModifiedDate
    private ZonedDateTime updatedAt;

    @Override
    public boolean isNew() {
        return turnOnTime != null && turnOffTime == null;
    }
}
