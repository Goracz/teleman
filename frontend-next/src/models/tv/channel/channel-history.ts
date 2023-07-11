import { ChannelCategory } from './channel-category';
import { WebOSApplication } from './web-os-application';

export interface ChannelHistory {
  id: string;
  channelId: string;
  channelName: string;
  channelCategory: ChannelCategory;
  channelLogoUrl: string;
  application: WebOSApplication;
  start: number;
  end: number;
  isNew: boolean;
}
