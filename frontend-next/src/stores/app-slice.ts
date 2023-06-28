import EventSource from 'eventsource';
import moment from 'moment';

/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { AutomationRule } from '../models/automation-rule';
import { Channel } from '../models/channel';
import { ChannelHistory } from '../models/channel-history';
import { LaunchPoint } from '../models/launch-point';
import { PowerState } from '../models/power-state-change';
import { UptimeLog } from '../models/uptime-log';
import { User } from '../models/user';
import { Volume } from '../models/volume';

export interface AppSliceState {
    user: User;
    channelList: { channelList: Channel[] };
    currentChannel: Channel;
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
    channelHistoryRaw: ChannelHistory[];
    egpData: any;
    volume: number | Volume;
    softwareInfo: {};
    tvIp: string | { ip: string };
    automationRules: AutomationRule[];
    launchPoints: { launchPoints: LaunchPoint[] };
}

const initialState: AppSliceState = {
    user: undefined as any,
    channelList: [] as any,
    currentChannel: {} as Channel,
    digitalTvChannelCount: 0,
    analogueTvChannelCount: 0,
    digitalRadioChannelCount: 0,
    connectionStatus: 0,
    powerState: undefined as any,
    volume: -1,
    egpData: {},
    uptime: undefined as any,
    channelHistory: [],
    channelHistoryRaw: [],
    softwareInfo: undefined as any,
    automationRules: undefined as any,
    tvIp: '',
    launchPoints: undefined as any,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setCurrentChannel(state, action) {
            state.currentChannel = action.payload;
        },
        setChannelList(state, action) {
            state.channelList = action.payload;
        },
        setTvIp(state, action) {
            state.tvIp = action.payload;
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
        setFilteredChannelHistory(state, action) {
            state.channelHistoryRaw = state.channelHistory;
            state.channelHistory = state.channelHistory.filter(
                (entry) =>
                    moment(action.payload[0]).isSameOrBefore(moment.unix(entry.start)) &&
                    moment(action.payload[1]).isSameOrAfter(moment.unix(entry.end))
            );
        },
        setLaunchPoints(state, action) {
            state.launchPoints = action.payload;
        },
    },
});

export const appActions = appSlice.actions;

export const appReducer = appSlice.reducer;

export default appSlice;
