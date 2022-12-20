import { DualChannel } from "./DualChannel";

export interface TvChannel {
  subscribed: boolean;
  channelTypeName: string;
  channelNumber: string;
  isChannelChanged: boolean;
  channelName: string;
  isInteractiveRestrictionChannel: boolean;
  isSkipped: boolean;
  isReplaceChannel: boolean;
  isLocked: boolean;
  isHEVCChannel: boolean;
  channelModeId: number;
  isInvisible: boolean;
  isScrambled: boolean;
  signalChannelId: string;
  physicalNumber: number;
  hybridtvType?: any;
  isDescrambled: boolean;
  channelModeName: string;
  channelId: string;
  favoriteGroup?: any;
  channelTypeId: number;
  isFineTuned: boolean;
  dualChannel: DualChannel;
}