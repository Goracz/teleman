import { ResponseInfo } from '../channels/ResponseInfo';
import { VolumeStatus } from './VolumeStatus';

export interface Volume extends ResponseInfo {
    callerId: string;
    volumeStatus: VolumeStatus;
};
