import { Dispatch } from '@reduxjs/toolkit';

import {
    ControlServiceEventCategory
} from '../models/teleman/events/control-service-event-category';
import { EventMessage } from '../models/teleman/events/event-message';
import {
    StatisticsServiceEventCategory
} from '../models/teleman/events/statistics-service-event-category';
import {
    AutomationServiceEventCategory
} from '../models/tv/automation/automation-service-event-category';
import { ChannelHistory } from '../models/tv/channel/channel-history';
import { PowerStateOption } from '../models/tv/power-state/power-state-option';
import { TvStates } from '../models/tv/system/tv-states';
import { appActions } from '../stores/app-slice';

const useControlServiceMessageHandler = (
    event: EventMessage,
    dispatch: Dispatch,
    powerState: PowerStateOption,
    channelHistory: ChannelHistory[],
): void => {
    const response = JSON.parse(event.data);

    const eventCategory: ControlServiceEventCategory = response.category;
    const message = response.payload;

    switch (eventCategory) {
        case ControlServiceEventCategory.VOLUME_CHANGED:
            dispatch(appActions.setVolume(message));
            break;
        case ControlServiceEventCategory.CHANNEL_CHANGED:
            dispatch(appActions.setCurrentChannel(message));
            break;
        case ControlServiceEventCategory.POWER_STATE_CHANGED:
            if (TvStates.OFFLINE.includes(powerState) && TvStates.ONLINE.includes(message.state)) {
                dispatch(
                    appActions.setChannelHistory([...channelHistory, { start: new Date().getTime() }])
                );
            } else if (
                TvStates.OFFLINE.includes(message.state) &&
                TvStates.ONLINE.includes(powerState)
            ) {
                dispatch(appActions.setChannelHistoryEnd(new Date()));
            }
            dispatch(appActions.setPowerState(message));
            break;
    }
};

const useStatisticsServiceEventHandler = (
    event: EventMessage,
    dispatch: Dispatch,
    powerState: PowerStateOption,
    channelHistory: ChannelHistory[],
): void => {
    const response = JSON.parse(event.data);

    const eventCategory: StatisticsServiceEventCategory = response.category;
    const message = response.payload;

    switch (eventCategory) {
        case StatisticsServiceEventCategory.CHANNEL_HISTORY_CHANGED:
            dispatch(appActions.setChannelHistoryEnd((message as ChannelHistory).end));
            dispatch(appActions.pushChannelHistory(message));

            break;
        case StatisticsServiceEventCategory.UPTIME_LOG_CHANGED:
            dispatch(appActions.setUptime(message));

            break;
        case StatisticsServiceEventCategory.POWER_STATE_CHANGED:
            if (TvStates.OFFLINE.includes(powerState as any) && TvStates.ONLINE.includes(message.state)) {
                dispatch(
                    appActions.setChannelHistory([...channelHistory, { start: new Date().getTime() }])
                );
            } else if (
                TvStates.OFFLINE.includes(message.state) &&
                TvStates.ONLINE.includes(powerState as any)
            ) {
                dispatch(appActions.setChannelHistoryEnd(new Date()));
            }
            dispatch(appActions.setPowerState(message));
    }
};

const useAutomationServiceEventHandler = (event: EventMessage, dispatch: Dispatch): void => {
    const response = JSON.parse(event.data);

    const eventCategory: AutomationServiceEventCategory = response.category;
    const message = response.payload;

    switch (eventCategory) {
        case AutomationServiceEventCategory.AUTOMATION_RULE_ADDED:
            dispatch(appActions.addAutomationRule(message));
            break;
        case AutomationServiceEventCategory.AUTOMATION_RULE_MODIFIED:
            dispatch(appActions.updateAutomationRule(message));
            break;
        case AutomationServiceEventCategory.AUTOMATION_RULE_REMOVED:
            dispatch(appActions.removeAutomationRule(message));
            break;
    }
};

export {
    useControlServiceMessageHandler,
    useStatisticsServiceEventHandler,
    useAutomationServiceEventHandler,
};
