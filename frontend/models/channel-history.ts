import { ChannelCategory } from './channel-category';

export interface ChannelHistory {
  id: string;
  channelId: string;
  channelName: string;
  channelCategory: ChannelCategory;
  channelLogoUrl: string;
  start: number;
  end: number;
  isNew: boolean;
}
