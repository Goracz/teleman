import { AutomationAction } from './automation-action';
import { AutomationScheduleKind } from './automation-schedule-kind';

export interface AutomationRule {
  id?: string;
  title: string;
  description?: string;
  actions: AutomationAction[];
  scheduleKind: AutomationScheduleKind;
  cronSchedule?: string;
  executionTime?: Date;
  isNew?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
