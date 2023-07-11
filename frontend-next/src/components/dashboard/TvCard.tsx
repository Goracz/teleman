import { memo } from 'react';

import { Constants } from '../../constants/constants';
import { useTvIp, useVolume } from '../../hooks';
import {
    useChannelsCount, useCurrentChannel, useNextChannel, usePreviousChannel
} from '../../hooks/channel';
import { useStatus, useUptimeSeconds } from '../../hooks/system';
import { useVolumeDown, useVolumeUp } from '../../hooks/volume';
import { ChannelType } from '../../models/tv/channel/channel-type';
import Heading from '../layout/Heading';
import { ChannelCard } from './tv-card/ChannelCard';
import { ChannelCountCard } from './tv-card/ChannelCountCard';
import { LanIpCard } from './tv-card/LanIpCard';
import { StatusCard } from './tv-card/StatusCard';
import { UptimeCard } from './tv-card/UptimeCard';
import { VolumeCard } from './tv-card/VolumeCard';

export const TvCard: React.FC = memo(() => {
    const status = useStatus();
    const uptimeInSeconds = useUptimeSeconds();
    const currentChannel = useCurrentChannel();
    const volume = useVolume();
    const [digitalChannelCount, analogueChannelCount, radioChannelCount] = useChannelsCount();
    const lanIp = useTvIp();

    return (
        <>
            <Heading title='TV' decoration='bg-accent' extraDecorationPath='/tv-decoration.svg' />
            <div className='grid grid-rows-2 gap-10 py-8 px-4'>
                <div className='grid xl:grid-cols-4 lg:grid-cols-2 xl:gap-8 lg:gap-4'>
                    <StatusCard status={status} />
                    <UptimeCard uptimeInSeconds={uptimeInSeconds} />
                    <ChannelCard
                        channelName={currentChannel.data?.channelName ?? Constants.NOT_AVAILABLE_TEXT}
                        channelLogoUrl={undefined}
                        onNextChannel={useNextChannel}
                        onPreviousChannel={usePreviousChannel}
                    />
                    <VolumeCard
                        currentVolume={volume.data?.volumeStatus.volume}
                        isLoading={volume.isLoading}
                        onVolumeUp={useVolumeUp}
                        onVolumeDown={useVolumeDown}
                    />
                </div>
                <div className='grid xl:grid-cols-4 lg:grid-cols-2 xl:gap-8 lg:gap-4'>
                    <ChannelCountCard
                        channelType={ChannelType.Digital}
                        channelCount={digitalChannelCount}
                    />
                    <ChannelCountCard
                        channelType={ChannelType.Analogue}
                        channelCount={analogueChannelCount}
                    />
                    <ChannelCountCard
                        channelType={ChannelType.Radio}
                        channelCount={radioChannelCount}
                    />
                    <LanIpCard lanIp={lanIp.data?.ip ?? Constants.UNKNOWN_VALUE_TEXT} />
                </div>
            </div>
        </>
    );
});
