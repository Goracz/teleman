import { VolumeStatus } from './volume-status';

export interface Volume {
  returnValue: boolean;
  volumeStatus: VolumeStatus;
  callerId: string;
}
