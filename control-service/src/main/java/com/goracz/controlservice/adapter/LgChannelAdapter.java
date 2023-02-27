package com.goracz.controlservice.adapter;

import com.goracz.controlservice.model.ChannelType;
import com.goracz.controlservice.model.response.LgChannel;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class LgChannelAdapter implements Channel {
    private LgChannel lgChannel;

    @Override
    public String getNumber() {
        return this.lgChannel.getChannelNumber();
    }

    @Override
    public String getName() {
        return this.lgChannel.getChannelName();
    }

    @Override
    public ChannelType getType() throws RuntimeException {
        return switch (this.lgChannel.getChannelType()) {
            case TV -> ChannelType.TV;
            case RADIO -> ChannelType.RADIO;
            default -> ChannelType.UNKNOWN;
        };
    }

    @Override
    public boolean isEncrypted() {
        return this.lgChannel.isPayChan();
    }
}
