import { useDispatch } from 'react-redux';

import { useQuery } from '@tanstack/react-query';

import { Constants } from '../constants/constants';
import { Channel } from '../models/channel';
import { appActions } from '../stores/app-slice';
import { fetcher } from '../utils/hooks';
import { useChannels, useCurrentChannel as useChannel } from './';

const useNavigateToChannel = (direction: 'previous' | 'next') => {
    const { data, error } = useQuery({
        queryKey: ['tvStateToggle', direction],
        queryFn: () => fetcher(`${Constants.CONTROL_SERVICE_BASE_URL}/tv/${direction}`, { method: 'POST' }),
    });

    return {
        data,
        isLoading: !error && !data,
        isError: error,
    };
};

/**
 * Switches to the previous channel.
 */
const usePreviousChannel = () => {
    return useNavigateToChannel('previous');
};

/**
 * Switches to the next channel.
 */
const useNextChannel = () => {
    return useNavigateToChannel("next");
};

/**
 * Returns the current channel.
 * @returns The current channel.
 */
const useCurrentChannel = () => {
    const currentChannel = useChannel();
    return currentChannel;
};

/**
 * Returns the number of digital, analogue and radio channels in order.
 * @returns {number} The number of digital, analogue and radio channels in order.
 */
const useChannelsCount = (): [number | undefined, number | undefined, number | undefined] => {
    const channels = useChannels();
    const channelList = channels.data?.channelList;

    const dispatch = useDispatch();

    const digitalChannels = channelList?.filter((channel: Channel) => channel.channelType === 'Cable Digital TV');
    const digitalChannelsCount = digitalChannels?.length;
    dispatch({ type: appActions.setDigitalTvChannelCount, payload: digitalChannelsCount });

    const analogueChannels = channelList?.filter((channel: Channel) => channel.channelType === 'Cable Analogue TV');
    const analogueChannelsCount = analogueChannels?.length
    dispatch({ type: appActions.setAnalogueTvChannelCount, payload: analogueChannelsCount });

    const radioChannels = channelList?.filter((channel: Channel) => channel.channelType === 'Cable Digital Radio');
    const radioChannelsCount = radioChannels?.length;
    dispatch({ type: appActions.setDigitalRadioChannelCount, payload: radioChannelsCount });

    return [digitalChannelsCount, analogueChannelsCount, radioChannelsCount];
};

export {
    usePreviousChannel,
    useNextChannel,
    useCurrentChannel,
    useChannelsCount,
};
