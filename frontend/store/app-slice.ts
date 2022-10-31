/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import EventSource from 'eventsource';
import { Channel } from '../models/channel';
import { PowerState } from '../models/power-state-change';

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
  uptime: any;
  volume: number;
  softwareInfo: {};
}

const initialState: AppSliceState = {
  channelList: [],
  currentChannel: {},
  digitalTvChannelCount: 0,
  analogueTvChannelCount: 0,
  digitalRadioChannelCount: 0,
  connectionStatus: EventSource.CLOSED,
  powerState: undefined as any,
  volume: -1,
  uptime: undefined as any,
  softwareInfo: {},
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
  },
});

export const appActions = appSlice.actions;

export const appReducer = appSlice.reducer;

export default appSlice;
