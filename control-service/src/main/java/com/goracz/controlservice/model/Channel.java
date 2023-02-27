package com.goracz.controlservice.model;

public abstract class Channel {
    protected abstract String getNumber();
    protected abstract String getName();
    protected abstract ChannelType getType();
    protected abstract boolean isEncrypted();
}
