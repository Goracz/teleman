package com.goracz.controlservice.adapter;

import com.goracz.controlservice.model.ChannelType;

public interface Channel {
    String getNumber();
    String getName();
    ChannelType getType();
    boolean isEncrypted();
}
