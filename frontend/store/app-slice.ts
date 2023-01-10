/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import EventSource from 'eventsource';
import { AutomationRule } from '../models/automation-rule';
import { Channel } from '../models/channel';
import { ChannelHistory } from '../models/channel-history';
import { PowerState } from '../models/power-state-change';
import { UptimeLog } from '../models/uptime-log';

export interface AppSliceState {
  channelList: Channel[];
  currentChannel: any;
  digitalTvChannelCount: number;
  analogueTvChannelCount: number;
  digitalRadioChannelCount: number;
  connectionStatus: EventSource.ReadyState;
  powerState: {
    returnValue: boolean;
    subscribed: boolean;
    reason: string;
    onOff: string;
    processing: string;
    state: keyof typeof PowerState;
  };
  uptime: UptimeLog;
  channelHistory: ChannelHistory[];
  egpData: any;
  volume: number;
  softwareInfo: {};
  automationRules: AutomationRule[];
}

const initialState: AppSliceState = {
  channelList: [],
  currentChannel: {},
  digitalTvChannelCount: 0,
  analogueTvChannelCount: 0,
  digitalRadioChannelCount: 0,
  connectionStatus: 0,
  powerState: undefined as any,
  volume: -1,
  egpData: {},
  uptime: undefined as any,
  channelHistory: [],
  softwareInfo: undefined as any,
  automationRules: undefined as any,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentChannel(state, action) {
      state.currentChannel = action.payload;
    },
    setChannelList(state, action) {
      state.channelList = action.payload;
    },
    setSoftwareInfo(state, action) {
      state.softwareInfo = action.payload;
    },
    setConnectionStatus(state, action) {
      state.connectionStatus = action.payload;
    },
    setPowerState(state, action) {
      state.powerState = action.payload;
    },
    setVolume(state, action) {
      state.volume = action.payload;
    },
    setUptime(state, action) {
      state.uptime = action.payload;
    },
    setDigitalTvChannelCount(state, action) {
      state.digitalTvChannelCount = action.payload;
    },
    setAnalogueTvChannelCount(state, action) {
      state.analogueTvChannelCount = action.payload;
    },
    setDigitalRadioChannelCount(state, action) {
      state.digitalRadioChannelCount = action.payload;
    },
    setChannelHistory(state, action) {
      state.channelHistory = action.payload;
    },
    setEgpData(state, action) {
      state.egpData = action.payload;
    },
    pushChannelHistory(state, action) {
      state.channelHistory.push(action.payload);
    },
    popChannelHistory(state) {
      state.channelHistory.pop();
    },
    setChannelHistoryEnd(state, action) {
      const lastChannelHistoryIndex = state.channelHistory.findIndex((entry) => !entry.end);
      const latestChannelHistory = { ...state.channelHistory[lastChannelHistoryIndex] };
      latestChannelHistory.end = action.payload;
      state.channelHistory[lastChannelHistoryIndex] = latestChannelHistory;
    },
    setAutomationRules(state, action) {
      state.automationRules = action.payload;
    },
    addAutomationRule(state, action) {
      state.automationRules = [...state.automationRules, action.payload];
    },
    updateAutomationRule(state, action) {
      const ruleIndex = state.automationRules.findIndex(
        (rule: AutomationRule) => rule.id === action.payload.id
      );
      state.automationRules[ruleIndex] = action.payload;
    },
    removeAutomationRule(state, action) {
      const ruleIndex = state.automationRules.findIndex(
        (rule: AutomationRule) => rule.id === action.payload.id
      );
      state.automationRules.splice(ruleIndex, 1);
    },
  },
});

export const appActions = appSlice.actions;

export const appReducer = appSlice.reducer;

export default appSlice;
