import { Channel } from './Channel';
import { ChannelListTunerChannel } from './ChannelListTunerChannel';
import { ResponseInfo } from './ResponseInfo';

export interface ChannelList extends ResponseInfo {
    ipChanInteractiveUrl: string;
    channelLogoServerUrl: string;
    valueList: string;
    channelListCount: number;
    dataSource: number;
    tuner_channel: ChannelListTunerChannel;
    dataType: number;
    channelList: Channel[];
};
