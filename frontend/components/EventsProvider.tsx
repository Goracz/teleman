import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventSource from 'eventsource';
import { IconCheck } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';
import { EventCategory } from '../models/event-category';
import { EventMessage } from '../models/event-message';
import { appActions } from '../store/app-slice';

const onlineStates = ['Active', 'Active Standby'];
const offlineStates = ['Suspend'];

export const EventsProvider: NextPage<any> = ({ children }) => {
  let eventStream = new EventSource('http://localhost:8080/api/v1/events/stream');

  const powerState = useSelector((state: any) => state.app.powerState);

  const dispatch = useDispatch();

  const reconnect = () => {
    eventStream = new EventSource('http://localhost:8080/api/v1/events/stream');
  };

  eventStream.onmessage = (event: EventMessage) => {
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
        if (offlineStates.includes(powerState) && onlineStates.includes(message.state)) {
          // TODO! Notifications are not being shown when called here
          showNotification({
            color: 'blue',
            title: 'Connection upgraded',
            message: 'You are directly connected to the TV',
            icon: <IconCheck size={16} />,
          });
        } else if (offlineStates.includes(message.state) && onlineStates.includes(powerState)) {
          showNotification({
            color: 'blue',
            title: 'Connection downgraded',
            message: 'You are connected to the system services',
            icon: <IconCheck size={16} />,
          });
        }
        dispatch(appActions.setPowerState(message));

        break;
    }
  };

  useEffect(() => {
    dispatch(appActions.setConnectionStatus(eventStream.readyState));
    if (eventStream.readyState === EventSource.CLOSED) {
      reconnect();
    }
  }, [eventStream.readyState]);

  return <>{children}</>;
};
