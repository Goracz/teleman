import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventSource from 'eventsource';
import { IconCheck } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';
import { Dispatch } from 'redux';
import { ControlServiceEventCategory } from '../models/control-service-event-category';
import { EventMessage } from '../models/event-message';
import { appActions, AppSliceState } from '../store/app-slice';
import { ChannelHistory } from '../models/channel-history';
import { AutomationServiceEventCategory } from '../models/automation-service-event-category';
import { StatisticsServiceEventCategory } from '../models/statistics-service-event-category';

const onlineStates = ['Active', 'Active Standby'];
const offlineStates = ['Suspend'];

const handleControlServiceMessage = (
  event: EventMessage,
  dispatch: Dispatch,
  powerState: string,
  channelHistory: ChannelHistory[]
): void => {
  const response = JSON.parse(event.data);

  // TODO: Remove console logs when stable
  console.log('Event received (raw): ', event.data);
  console.log('Event received (parsed): ', response);

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
      if (offlineStates.includes(powerState as any) && onlineStates.includes(message.state)) {
        // TODO! Notifications are not being shown when called here
        showNotification({
          color: 'blue',
          title: 'Connection upgraded',
          message: 'You are directly connected to the TV',
          icon: <IconCheck size={16} />,
        });
        dispatch(
          appActions.setChannelHistory([...channelHistory, { start: new Date().getTime() }])
        );
      } else if (
        offlineStates.includes(message.state) &&
        onlineStates.includes(powerState as any)
      ) {
        showNotification({
          color: 'blue',
          title: 'Connection downgraded',
          message: 'You are connected to the system services',
          icon: <IconCheck size={16} />,
        });
        dispatch(appActions.setChannelHistoryEnd(new Date()));
      }
      dispatch(appActions.setPowerState(message));
      break;
  }
};

const handleStatisticsServiceEvent = (
  event: EventMessage,
  dispatch: Dispatch,
  powerState: string,
  channelHistory: ChannelHistory[]
): void => {
  const response = JSON.parse(event.data);

  // TODO: Remove console logs when stable
  console.log('Channel history event received (raw): ', event.data);
  console.log('Channel history event received (parsed): ', response);

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
      if (offlineStates.includes(powerState as any) && onlineStates.includes(message.state)) {
        // TODO! Notifications are not being shown when called here
        showNotification({
          color: 'blue',
          title: 'Connection upgraded',
          message: 'You are directly connected to the TV',
          icon: <IconCheck size={16} />,
        });
        dispatch(
          appActions.setChannelHistory([...channelHistory, { start: new Date().getTime() }])
        );
      } else if (
        offlineStates.includes(message.state) &&
        onlineStates.includes(powerState as any)
      ) {
        showNotification({
          color: 'blue',
          title: 'Connection downgraded',
          message: 'You are connected to the system services',
          icon: <IconCheck size={16} />,
        });
        dispatch(appActions.setChannelHistoryEnd(new Date()));
      }
      dispatch(appActions.setPowerState(message));
  }
};

const handleAutomationServiceEvent = (event: EventMessage, dispatch: Dispatch): void => {
  const response = JSON.parse(event.data);

  // TODO: Remove console logs when stable
  console.log('Automation event received (raw): ', event.data);
  console.log('Automation event received (parsed): ', response);

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

export const EventsProvider: NextPage<any> = ({ children }) => {
  const dispatch = useDispatch();

  const connectionStatus = useSelector(
    (state: { app: AppSliceState }) => state.app.connectionStatus
  );
  const powerState = useSelector((state: { app: AppSliceState }) => state.app.powerState);
  const channelHistory: ChannelHistory[] = useSelector(
    (state: { app: AppSliceState }) => state.app.channelHistory
  );

  useEffect(() => {
    const controlServiceEventStream = new EventSource('http://localhost:8080/api/v1/events/stream');
    console.log('Subscribed to control service event stream...');

    // TODO! This should be refactored as soon as possible - the application should only have 1 event stream.
    const statisticsServiceEventStream = new EventSource(
      'http://localhost:8081/api/v1/events/stream'
    );
    console.log('Subscribed to statistics service event stream...');

    const automationEventStream = new EventSource('http://localhost:8083/api/v1/events/stream');
    console.log('Subscribed to automation service event stream...');

    controlServiceEventStream.onmessage = (event: EventMessage) => {
      try {
        handleControlServiceMessage(event, dispatch, powerState as any, channelHistory);
      } catch (error: any) {
        console.error(`Could not process control service event message: ${error}`);
      }
    };
    controlServiceEventStream.onopen = (): void => {
      if (connectionStatus === 2) {
        dispatch(appActions.setConnectionStatus(1));
      }
    };

    statisticsServiceEventStream.onmessage = (event: EventMessage) => {
      try {
        handleStatisticsServiceEvent(event, dispatch, powerState as any, channelHistory);
      } catch (error: any) {
        console.error(`Could not process channel history service event message: ${error}`);
      }
    };

    automationEventStream.onmessage = (event: EventMessage) => {
      try {
        handleAutomationServiceEvent(event, dispatch);
      } catch (error: any) {
        console.error(`Could not process automation service event message: ${error}`);
      }
    };
  }, []);

  return <>{children}</>;
};
