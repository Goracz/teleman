package com.goracz.lgwebosstatsservice.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class EventMessage<T> {
    private EventCategory category;
    private T payload;
}
