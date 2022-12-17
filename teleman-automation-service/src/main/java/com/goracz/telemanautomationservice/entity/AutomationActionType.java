package com.goracz.telemanautomationservice.entity;

public enum AutomationActionType {
    /**
     * Indicates that the TV should be turned on
     */
    TURN_ON,
    /**
     * Indicates that the TV should be turned off
     */
    TURN_OFF,
    /**
     * Indicates that a specific TV channel should be set
     */
    SET_CHANNEL,
    /**
     * Indicates that a specific volume should be set
     */
    SET_VOLUME,
    /**
     * Indicates that a specific application should be set
     */
    OPEN_APPLICATION;
}
