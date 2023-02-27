export interface VolumeStatus {
  volumeLimitable: boolean;
  activeStatus: boolean;
  maxVolume: number;
  volumeLimiter: string;
  soundOutput: string;
  mode: string;
  externalDeviceControl: boolean;
  volume: number;
  volumeSyncable: boolean;
  adjustVolume: boolean;
  muteStatus: boolean;
  cause: string;
}
