import { PowerState } from './power-state-change';

export interface PowerState {
  state: keyof typeof PowerState;
  [key: string]: any;
}
