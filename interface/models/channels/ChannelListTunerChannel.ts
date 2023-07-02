import {
    ChannelListTunerChannelScannedChannelCount
} from './ChannelListTunerChannelScannedChannelCount';
import { ResponseInfo } from './ResponseInfo';

export interface ChannelListTunerChannel extends ResponseInfo {
    scannedChannelCount: ChannelListTunerChannelScannedChannelCount;
    deviceSourceIndex: number;
    cableAnalogSkipped: boolean;
    channelListCount: number;
    dataType: number;
    valueList: string;
};
