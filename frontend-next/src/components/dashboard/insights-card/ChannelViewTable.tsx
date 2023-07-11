import { memo } from 'react';

import { useMostViewedChannels } from '../../../hooks/dashboard/insights/ChannelViewTableHooks';
import { ChannelHistory } from '../../../models/tv/channel/channel-history';
import { useHumanizedSeconds } from '../../../utils/hooks';

interface ChannelViewTableProps {
    channelHistories?: ChannelHistory[];
};

const baseChannelItemClasses = `relative flex flex-row border-b-2 border-black items-center place-content-between hover:bg-gray-100 transition duration-200`;

const getChannelItemClasses = (length: number, index: number): string => {
    return index === length - 1 ? `${baseChannelItemClasses} border-b-0` : baseChannelItemClasses;
};

export const ChannelViewTable: React.FC<ChannelViewTableProps> = memo(({ channelHistories }) => {
    const mostViewedChannels = useMostViewedChannels(channelHistories);

    return (
        <>
            <div className='py-10 flex flex-col'>
                <span className='text-2xl font-medium pb-2'>Channels</span>
                {mostViewedChannels?.map((channel, index) => (
                    <div 
                        key={channel.channelName} 
                        className={getChannelItemClasses(mostViewedChannels.length, index)}
                        style={{ 
                            backgroundImage: `linear-gradient(to right, ${channel.decorationColor} 0%, ${channel.decorationColor} 100%)`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: `${channel.quotient}% 100%`
                        }}
                    >
                        <span className='text-lg font-medium text-left'>
                            {channel.channelName} - {useHumanizedSeconds(channel.viewSeconds)}
                        </span>
                        {channel.logoUrl ? (
                            <img src={channel.logoUrl} className='h-16'></img>
                        ) : (
                            <span className='text-right text-lg'>Logo placeholder</span>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
});
