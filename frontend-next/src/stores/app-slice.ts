import EventSource from 'eventsource';
import moment from 'moment';

/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { User } from '../models/teleman/auth/user';
import { UptimeLog } from '../models/teleman/uptime-log/uptime-log';
import { AutomationRule } from '../models/tv/automation/automation-rule';
import { Channel } from '../models/tv/channel/channel';
import { ChannelHistory } from '../models/tv/channel/channel-history';
import {
    ElectronicProgramGuide
} from '../models/tv/electronic-program-guide/electronic-program-guide';
import { Volume } from '../models/tv/media/volume';
import { PowerStateOption } from '../models/tv/power-state/power-state-option';
import { LaunchPoint } from '../models/tv/system/launch-point';
import { SoftwareInformation } from '../models/tv/system/software-information';

export interface AppSliceState {
    user?: User;
    channelList?: { channelList: Channel[] };
    currentChannel?: Channel;
    digitalTvChannelCount: number;
    analogueTvChannelCount: number;
    digitalRadioChannelCount: number;
    connectionStatus: EventSource.ReadyState;
    powerState?: PowerStateOption;
    uptime?: UptimeLog;
    channelHistory: ChannelHistory[];
    channelHistoryRaw: ChannelHistory[];
    egpData?: ElectronicProgramGuide;
    volume?: Volume;
    softwareInfo?: SoftwareInformation;
    tvIp: string | { ip: string };
    automationRules?: AutomationRule[];
    launchPoints?: { launchPoints: LaunchPoint[] };
}

const initialState: AppSliceState = {
    user: undefined,
    channelList: undefined,
    currentChannel: undefined,
    digitalTvChannelCount: 0,
    analogueTvChannelCount: 0,
    digitalRadioChannelCount: 0,
    connectionStatus: 0,
    powerState: undefined,
    volume: undefined,
    egpData: undefined,
    uptime: undefined,
    channelHistory: [],
    channelHistoryRaw: [],
    softwareInfo: undefined,
    automationRules: undefined,
    tvIp: '',
    launchPoints: undefined,
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
            state.automationRules = [...state.automationRules ?? [], action.payload];
        },
        updateAutomationRule(state, action) {
            if (!state.automationRules) throw new Error(
                `Could not update automation rule with ID ${action.payload.id} as it is not in the store.`
            );

            const ruleIndex = state.automationRules.findIndex(
                (rule: AutomationRule) => rule.id === action.payload.id
            );
            state.automationRules[ruleIndex] = action.payload;
        },
        removeAutomationRule(state, action) {
            if (!state.automationRules) throw new Error(
                `Could not remove automation rule with ID ${action.payload.id} as there are no automation rules in the store.`
            );

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
