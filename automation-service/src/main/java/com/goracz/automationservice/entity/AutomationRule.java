package com.goracz.automationservice.entity;

import com.goracz.automationservice.model.request.AddAutomationRuleRequest;
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
import java.util.Collection;

@Document
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AutomationRule implements Serializable {
    @Id
    private String id;
    private String title;
    private String description;
    private Collection<AutomationAction> actions;
    private AutomationScheduleKind scheduleKind;
    private String cronSchedule;
    private ZonedDateTime executionTime;
    @CreatedDate
    private ZonedDateTime createdAt;
    @LastModifiedDate
    private ZonedDateTime updatedAt;

    public AutomationRule updateWithDto(AddAutomationRuleRequest dto) {
        this.setActions(dto.getActions());
        this.setCronSchedule(dto.getCronSchedule());
        return this;
    }

    public boolean isCronJob() {
        return this.getScheduleKind().equals(AutomationScheduleKind.CRON);
    }

    public boolean isDateJob() {
        return this.getScheduleKind().equals(AutomationScheduleKind.DATE_TIME);
    }

    public static AutomationRule fromDto(AddAutomationRuleRequest dto) {
        return AutomationRule
                .builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .scheduleKind(dto.getScheduleKind())
                .executionTime(dto.getExecutionTime())
                .cronSchedule(dto.getCronSchedule())
                .actions(dto.getActions())
                .cronSchedule(dto.getCronSchedule())
                .build();
    }
}
