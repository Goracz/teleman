import { AutomationActionType } from './automation-action-type';

export interface AutomationAction {
  id?: string;
  priority: number;
  type: AutomationActionType;
  appId: string;
  channelId: string;
  volume: number;
  createdAt?: Date;
  updatedAt?: Date;
}
