package com.goracz.statsservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@Document
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class UptimeLog {
    @Id
    private String id;
    private ZonedDateTime turnOnTime;
    private ZonedDateTime turnOffTime;
    @CreatedDate
    private ZonedDateTime createdAt;
    @LastModifiedDate
    private ZonedDateTime updatedAt;

    public static UptimeLog withCurrentTime() {
        return UptimeLog.builder()
                .turnOnTime(ZonedDateTime.now(ZoneId.of("UTC")))
                .build();
    }

    public UptimeLog setTurnOffToNow() {
        this.turnOffTime = ZonedDateTime.now(ZoneId.of("UTC"));
        return this;
    }
}
