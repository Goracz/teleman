package com.goracz.controlservice.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A description of a service.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceDescription {
    /**
     * The name of the service.
     */
    private String name;
    /**
     * The version of the service.
     */
    private String version;
    /**
     * The kind of component this service is.
     */
    private ComponentKind kind;
    /**
     * The layer which the component belongs to.
     */
    private int layer;
}
