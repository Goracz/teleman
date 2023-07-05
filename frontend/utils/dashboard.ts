import 'moment-timezone';

import moment from 'moment/moment';

import { ChannelHistory } from '../models/channel-history';

/**
 * Calculates that on a given day, how many minutes was the TV watched by every hour in 24 hours
 * @param channelHistories
 * @param day
 * @returns
 */
const calculateHowManyMinutesWatchedInAGivenHour = (
  channelHistories: ChannelHistory[],
  day: Date
) => {
  const dayChannelHistories = channelHistories.filter(
    (channelHistory) =>
      (moment.unix(channelHistory.start).isSame(day, 'day') && channelHistory.end) ||
      moment.unix(channelHistory.end).isSame(day, 'day')
  );

  const hours = new Array(24).fill(0);
  const timezone = moment.tz('Europe/London').format();

  dayChannelHistories.forEach((channelHistory) => {
    const startDate = moment.tz(moment.unix(channelHistory.start), timezone);
    const startDateHour = startDate.hour();
    const endDate = moment.tz(moment.unix(channelHistory.end), timezone);
    const endDateHour = endDate.hour();

    if (endDateHour < startDateHour) {
      for (let i = 0; i <= endDateHour; i += 1) {
        let duration: number;

        if (startDateHour === i) {
          duration = 60 - startDate.minute();
        } else if (i < endDateHour) {
          duration = 60 - startDate.hour(i).minute(0).minutes();
        } else {
          duration = endDate.minute();
        }

        hours[i] + duration > 60 ? (hours[i] = 60) : (hours[i] += duration);
      }
    } else {
      for (let i = startDateHour; i <= endDateHour; i += 1) {
        let duration: number;

        if (startDateHour === i) {
          duration = 60 - startDate.minute();
        } else if (endDateHour > startDateHour && i < endDateHour) {
          duration = 60 - startDate.hour(i).minute(0).minutes();
        } else {
          duration = endDate.minute();
        }

        hours[i] + duration > 60 ? (hours[i] = 60) : (hours[i] += duration);
      }
    }
  });

  const lastChannelHistoryEntry = channelHistories[channelHistories.length - 1];
  if (lastChannelHistoryEntry && !lastChannelHistoryEntry.end) {
    const startDate = moment.tz(moment.unix(lastChannelHistoryEntry.start), timezone);
    const startDateHour = startDate.hour();

    const now = moment();
    const nowHour = now.hour();

    if (startDateHour === nowHour) {
      hours[startDateHour] += now.diff(startDate, 'minutes');
    } else {
      for (let i = startDateHour; i <= nowHour; i += 1) {
        let duration: number;

        if (startDateHour === i) {
          duration = 60 - startDate.minute();
        } else if (i < nowHour) {
          duration = 60 - startDate.hour(i).minute(0).minutes();
        } else {
          duration = now.minute();
        }

        hours[i] + duration > 60 ? (hours[i] = 60) : (hours[i] += duration);
      }
    }
  }

  return hours;
};

const addAMinuteToLastHourInHourlyChannelView = (today: Date, calculatedHourlyChannelView: any) => {
  const currentHour = today.getHours();
  const newCalculatedHourlyChannelView = [...calculatedHourlyChannelView];
  newCalculatedHourlyChannelView[currentHour].minutes += 1;

  return newCalculatedHourlyChannelView;
};

export { calculateHowManyMinutesWatchedInAGivenHour, addAMinuteToLastHourInHourlyChannelView };
