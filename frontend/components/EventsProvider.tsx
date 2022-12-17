import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventSource from 'eventsource';
import { IconCheck } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';
import { EventCategory } from '../models/event-category';
import { EventMessage } from '../models/event-message';
import { appActions, AppSliceState } from '../store/app-slice';
import { ChannelHistory } from '../models/channel-history';

const onlineStates = ['Active', 'Active Standby'];
const offlineStates = ['Suspend'];

export const EventsProvider: NextPage<any> = ({ children }) => {
  const dispatch = useDispatch();

  const powerState = useSelector((state: { app: AppSliceState }) => state.app.powerState);
  const channelHistory: ChannelHistory[] = useSelector(
    (state: { app: AppSliceState }) => state.app.channelHistory
  );

  useEffect(() => {
    const eventStream = new EventSource('http://localhost:8080/api/v1/events/stream');
    // TODO! This should be refactored as soon as possible - the application should only have 1 event stream.
    const channelHistoryEventStream = new EventSource('http://localhost:8081/api/v1/events/stream');
    const automationEventStream = new EventSource('http://localhost:8083/api/v1/events/stream');

    // const reconnect = () => {
    //   eventStream = new EventSource('http://localhost:8080/api/v1/events/stream');
    // };

    eventStream.onmessage = (event: EventMessage) => {
      try {
        const response = JSON.parse(event.data);

        // TODO: Remove console logs when stable
        console.log('Event received (raw): ', event.data);
        console.log('Event received (parsed): ', response);

        const eventCategory: EventCategory = response.category;
        const message = response.payload;

        switch (eventCategory) {
          case EventCategory.VOLUME_CHANGED:
            dispatch(appActions.setVolume(message));
            break;
          case EventCategory.CHANNEL_CHANGED:
            dispatch(appActions.setCurrentChannel(message));
            break;
          case EventCategory.POWER_STATE_CHANGED:
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
              dispatch(appActions.setUptime(new Date().getTime()));
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
          case EventCategory.AUTOMATION_RULE_ADDED:
            dispatch(appActions.addAutomationRule(message));
            break;
          case EventCategory.AUTOMATION_RULE_MODIFIED:
            dispatch(appActions.updateAutomationRule(message));
            break;
          case EventCategory.AUTOMATION_RULE_REMOVED:
            dispatch(appActions.removeAutomationRule(message));
            break;
        }
      } catch (error: any) {
        console.error(`Could not process control service event message: ${error}`);
      }
    };

    channelHistoryEventStream.onmessage = (event: EventMessage) => {
      try {
        const response = JSON.parse(event.data);

        // TODO: Remove console logs when stable
        console.log('Channel history event received (raw): ', event.data);
        console.log('Channel history event received (parsed): ', response);

        const eventCategory: EventCategory = response.category;
        const message = response.payload;

        switch (eventCategory) {
          case EventCategory.CHANNEL_HISTORY_CHANGED:
            dispatch(appActions.setChannelHistoryEnd((message as ChannelHistory).end));
            dispatch(appActions.pushChannelHistory(message));

            break;
        }
      } catch (error: any) {
        console.error(`Could not process channel history service event message: ${error}`);
      }
    };

    automationEventStream.onmessage = (event: EventMessage) => {
      try {
        const response = JSON.parse(event.data);

        // TODO: Remove console logs when stable
        console.log('Automation event received (raw): ', event.data);
        console.log('Automation event received (parsed): ', response);

        const eventCategory: EventCategory = response.category;
        const message = response.payload;

        switch (eventCategory) {
          case EventCategory.AUTOMATION_RULE_ADDED:
            dispatch(appActions.addAutomationRule(message));
            break;
          case EventCategory.AUTOMATION_RULE_MODIFIED:
            dispatch(appActions.updateAutomationRule(message));
            break;
          case EventCategory.AUTOMATION_RULE_REMOVED:
            dispatch(appActions.removeAutomationRule(message));
            break;
        }
      } catch (error: any) {
        console.error(`Could not process automation service event message: ${error}`);
      }
    };
  }, []);

  return <>{children}</>;
};
