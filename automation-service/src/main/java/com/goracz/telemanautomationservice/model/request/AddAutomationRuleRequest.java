package com.goracz.telemanautomationservice.model.request;

import com.goracz.telemanautomationservice.entity.AutomationAction;
import com.goracz.telemanautomationservice.entity.AutomationScheduleKind;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.time.ZonedDateTime;
import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AddAutomationRuleRequest {
    @NotBlank
    private String title;
    private String description;
    @Length(min = 1, max = 64)
    private Collection<AutomationAction> actions;
    @NotNull
    private AutomationScheduleKind scheduleKind;
    @Pattern(regexp = "/(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\\d+(ns|us|µs|ms|s|m|h))+)|((((\\d+,)+\\d+|(\\d+(\\/|-)\\d+)|\\d+|\\*) ?){5,7})/")
    private String cronSchedule;
    private ZonedDateTime executionTime;
}
