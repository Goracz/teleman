import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Constants } from '../constants/constants';
import {
    useAutomationServiceEventHandler, useControlServiceMessageHandler,
    useStatisticsServiceEventHandler
} from '../hooks/events-provider';
import { EventMessage } from '../models/teleman/events/event-message';
import { ChannelHistory } from '../models/tv/channel/channel-history';
import { appActions, AppSliceState } from '../stores/app-slice';

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();

    const connectionStatus = useSelector(
        (state: { app: AppSliceState }) => state.app.connectionStatus
    );
    const powerState = useSelector((state: { app: AppSliceState }) => state.app.powerState);
    const channelHistory: ChannelHistory[] = useSelector(
        (state: { app: AppSliceState }) => state.app.channelHistory
    );

    useEffect(() => {
        const controlServiceEventStream = new EventSource(`${Constants.CONTROL_SERVICE_BASE_URL}/events/stream`);
        controlServiceEventStream.onopen = (_: Event) => {
            console.info('Subscribed to control service event stream...');
            if (connectionStatus === EventSource.CLOSED) {
                console.debug('Control service event stream has been closed, updating connection status...');
                dispatch(appActions.setConnectionStatus(1));
            }
        };

        // TODO! This should be refactored as soon as possible - the application should only have 1 event stream.
        const statisticsServiceEventStream = new EventSource(
            `${Constants.STATISTICS_SERVICE_BASE_URL}/events/stream`
        );
        statisticsServiceEventStream.onopen = (_: Event) => {
            console.info('Subscribed to statistics service event stream...');
        };

        const automationEventStream = new EventSource(`${Constants.AUTOMATION_SERVICE_BASE_URL}/events/stream`);
        automationEventStream.onopen = (_: Event) => {
            console.info('Subscribed to automation service event stream...');
        };

        controlServiceEventStream.onmessage = (event: EventMessage) => {
            try {
                if (!powerState) return;
                useControlServiceMessageHandler(event, dispatch, powerState, channelHistory);
            } catch (error: any) {
                console.error(`Could not process control service event message: ${error}`);
            }
        };

        statisticsServiceEventStream.onmessage = (event: EventMessage) => {
            try {
                if (!powerState) return;
                useStatisticsServiceEventHandler(event, dispatch, powerState, channelHistory);
            } catch (error: any) {
                console.error(`Could not process channel history service event message: ${error}`);
            }
        };

        automationEventStream.onmessage = (event: EventMessage) => {
            try {
                useAutomationServiceEventHandler(event, dispatch);
            } catch (error: any) {
                console.error(`Could not process automation service event message: ${error}`);
            }
        };
    }, []);

    return <>{children}</>;
};
