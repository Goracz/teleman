package com.goracz.controlservice.model;

import lombok.Data;

/**
 * Abstract class for all channels (for different manufacturers)
 * @param <T> Type of the channel (e.g. TV, Radio, Unknown, etc.)
 */
@Data
public abstract class AbstractChannel<T> {
    /**
     * Channel number (e.g. 1, 2, 3, etc.)
     */
    protected String number;
    /**
     * Channel name
     */
    protected String name;
    /**
     * Type of the channel (e.g. TV, Radio, Unknown, etc.)
     */
    protected T type;
    /**
     * Indicates if the channel data flow is encrypted (the channel is paid)
     */
    protected boolean encrypted;
}
