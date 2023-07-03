import moment from 'moment';
import { tz } from 'moment-timezone';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Col, Grid, Skeleton, useMantineColorScheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';

import Filter from '../../components/Dashboard/Filter';
import QuickAppLauncher from '../../components/Dashboard/QuickAppLauncher';
import TvCard from '../../components/Dashboard/TvCard';
import UptimeChart from '../../components/Dashboard/UptimeChart';
import { RingStatistics } from '../../components/Statistics/RingStatistics';
import { RingStatisticsChannelCategory } from '../../components/Statistics/RingStatisticsChannelCategory';
import {
  useChannelHistory,
  useChannels,
  useCurrentChannel,
  useEGP,
  useSoftwareInformation,
  useSystemPower,
  useTvIp,
  useUptime,
  useVolume,
} from '../../hooks';
import ApplicationLayout from '../../layouts/Application';
import { Channel } from '../../models/channel';
import { ChannelCategory } from '../../models/channel-category';
import { ChannelHistory } from '../../models/channel-history';
import { PowerState } from '../../models/power-state-change';
import { UptimeLog } from '../../models/uptime-log';
import { appActions, AppSliceState } from '../../store/app-slice';

const ONE_MINUTE_MILLIS = 1000 * 60;

// Calculates that on a given day, how many minutes was the TV watched by every hour in 24 hours
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
  const timezone = tz('Europe/London').format();

  dayChannelHistories.forEach((channelHistory) => {
    const startDate = tz(moment.unix(channelHistory.start), timezone);
    const startDateHour = startDate.hour();
    const endDate = tz(moment.unix(channelHistory.end), timezone);
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
    const startDate = tz(moment.unix(lastChannelHistoryEntry.start), timezone);
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

const DashboardPage: NextPage = () => {
  const [calculatedTvUptime, setCalculatedTvUptime] = React.useState<string>('-');
  const [calculatedChannelHistory, setCalculatedChannelHistory] = React.useState<
    {
      channelName: string;
      channelCategory: ChannelCategory;
      channelLogoUrl: string;
      watchTime: number;
    }[]
  >();
  const [calculatedChannelCategoryStats, setCalculatedChannelCategoryStats] = React.useState<
    {
      channelCategory: string;
      application: string;
      watchTime: number;
    }[]
  >();
  const [calculatedHourlyChannelView, setCalculatedHourlyChannelView] = React.useState<any>();

  const colorScheme = useMantineColorScheme();
  const dispatch = useDispatch();

  const connectionStatus = useSelector(
    (state: { app: AppSliceState }) => state.app.connectionStatus
  );
  const digitalTvChannelCount = useSelector(
    (state: { app: AppSliceState }) => state.app.digitalTvChannelCount
  );
  const analogueTvChannelCount = useSelector(
    (state: { app: AppSliceState }) => state.app.analogueTvChannelCount
  );
  const digitalRadioChannelCount = useSelector(
    (state: { app: AppSliceState }) => state.app.digitalRadioChannelCount
  );

  let isLoadingTvStateToggle = false;
  let isTvStateToggleError;

  const {
    data: powerState,
    isLoading: isLoadingPowerState,
    isError: isPowerStateError,
  } = useSystemPower();
  if (!isLoadingPowerState && !isPowerStateError) {
    dispatch(appActions.setPowerState(powerState));
  }

  const {
    data: currentChannel,
    isLoading: isLoadingCurrentChannel,
    isError: isCurrentChannelError,
  } = useCurrentChannel();
  if (!isLoadingCurrentChannel && !isCurrentChannelError) {
    dispatch(appActions.setCurrentChannel(currentChannel));
  }

  const {
    data: channelList,
    isLoading: isLoadingChannelList,
    isError: isChannelsError,
  } = useChannels();
  if (
    !isLoadingChannelList &&
    !isChannelsError &&
    (typeof isChannelsError !== 'undefined' || !isChannelsError) &&
    channelList &&
    typeof channelList.channelList !== 'undefined' &&
    channelList.channelList !== null
  ) {
    dispatch(
      appActions.setDigitalTvChannelCount(
        channelList.channelList.filter(
          (channel: Channel) => channel.channelType === 'Cable Digital TV'
        ).length
      )
    );
    dispatch(appActions.setChannelList(channelList));
  } // else if (typeof window !== 'undefined') {
  // router.replace(`/error/missing-state-information?reason=${StateError.CHANNEL_LIST_MISSING}`);
  // }

  const {
    data: softwareInfo,
    isLoading: isLoadingSoftwareInfo,
    isError: isSoftwareInfoError,
  } = useSoftwareInformation();
  if (!isLoadingSoftwareInfo && !isSoftwareInfoError) {
    dispatch(appActions.setSoftwareInfo(softwareInfo));
  }

  const { data: tvIp, isLoading: isLoadingTvIp, isError: isTvIpError } = useTvIp();
  if (!isLoadingTvIp && !isTvIpError) {
    dispatch(appActions.setTvIp(tvIp));
  }

  const { data: volume, isLoading: isLoadingVolume, isError: isVolumeError } = useVolume();
  if (!isLoadingVolume && !isVolumeError) {
    dispatch(appActions.setVolume(volume));
  }

  const { data: tvUptime, isLoading: isLoadingTvUptime, isError: isTvUptimeError } = useUptime();
  if (!isLoadingTvUptime && !isTvUptimeError) {
    dispatch(appActions.setUptime(tvUptime));
  }

  const handleToggleTvState = async () => {
    isLoadingTvStateToggle = true;
    const desiredState: 'on' | 'off' = ![PowerState['Active Standby'], PowerState.Suspend].includes(
      powerState.state
    )
      ? 'off'
      : 'on';

    const result = await fetch(`http://localhost:8080/api/v1/system/power/${desiredState}`, {
      method: 'post',
    });
    isLoadingTvStateToggle = false;
    isTvStateToggleError = !result.ok;

    if (!isTvStateToggleError) {
      showNotification({
        color: 'teal',
        title: 'Success',
        message: `LG C2 has been turned ${desiredState}.`,
        icon: <IconCheck size={16} />,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Error',
        message: `Could not turn ${desiredState} LG C2`,
        icon: <IconX size={16} />,
      });
    }
  };

  const formatUptime = (textToFormat: string): string =>
    textToFormat === 'Invalid date' ? '-' : textToFormat.replace(':', 'h ').replace(':', 'm ');

  const {
    data: channelHistory,
    isLoading: isLoadingChannelHistory,
    isError: isChannelHistoryError,
  } = useChannelHistory(new Date('2022-10-01'), new Date('2099-12-31'));
  if (!isLoadingChannelHistory && !isChannelHistoryError) {
    dispatch(appActions.setChannelHistory(channelHistory));
  }

  useEffect(() => {
    if (!channelHistory) return;
    const filteredData = channelHistory.filter(
      (item: ChannelHistory) => typeof item.end !== 'undefined' && item.end !== null
    );
    const groupedData = filteredData.reduce(
      (r: { [x: string]: any }, a: { channelName: string | number }) => {
        // eslint-disable-next-line no-param-reassign
        r[a.channelName] = [...(r[a.channelName] || []), a];
        return r;
      },
      Object.create(null)
    );

    const watchTimeByChannel = Object.keys(groupedData).map((key) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const channelHistory = groupedData[key] as ChannelHistory[];
      const { channelCategory, channelLogoUrl } = channelHistory[0];
      const watchTime = channelHistory.reduce((a, b) => a + (b.end - b.start), 0);
      return {
        channelName: key,
        channelCategory,
        channelLogoUrl,
        watchTime,
      };
    });
    setCalculatedChannelHistory(watchTimeByChannel);
    const channelsByCategory = filteredData.reduce(
      (r: { [x: string]: any }, a: { channelCategory: string | number }) => {
        // eslint-disable-next-line no-param-reassign
        r[a.channelCategory] = [...(r[a.channelCategory] || []), a];
        return r;
      },
      Object.create(null)
    );
    const watchTimeByCategory = Object.keys(channelsByCategory).map((key) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const channelHistory = channelsByCategory[key] as ChannelHistory[];
      const watchTime = channelHistory.reduce((a, b) => a + (b.end - b.start), 0);
      return {
        channelCategory: key,
        watchTime,
      };
    });
    setCalculatedChannelCategoryStats(watchTimeByCategory as any);
  }, [channelHistory]);

  useEffect(() => {
    if (!channelHistory) return;
    const today = new Date();

    const result = calculateHowManyMinutesWatchedInAGivenHour(channelHistory, today);
    const formattedResult = result.map((item, index) => ({
      hour: index,
      minutes: item,
    }));

    setCalculatedHourlyChannelView(formattedResult);
  }, [channelHistory]);

  const shouldNotUptimeChartBeUpdated = (): boolean =>
    !calculatedHourlyChannelView || !channelHistory;

  const isLatestChannelHistoryWithoutEndDate = (
    today: Date,
    latestChannelHistoryEntry: ChannelHistory
  ): boolean =>
    latestChannelHistoryEntry &&
    typeof latestChannelHistoryEntry.end === 'undefined' &&
    latestChannelHistoryEntry.start > today.setHours(0, 0, 0, 0);

  const addAMinuteToLastHourInHourlyChannelView = (today: Date) => {
    const currentHour = today.getHours();
    const newCalculatedHourlyChannelView = [...calculatedHourlyChannelView];
    newCalculatedHourlyChannelView[currentHour].minutes += 1;

    return newCalculatedHourlyChannelView;
  };

  setInterval(() => {
    // If the TV is still turned on (the latest channel history entry does not have an end),
    // add plus one minute to the current hour in calculated hourly channel view without recalculating the whole thing
    if (shouldNotUptimeChartBeUpdated()) return;

    const latestChannelHistoryEntry = channelHistory[channelHistory.length - 1];
    const today = new Date();
    if (isLatestChannelHistoryWithoutEndDate(today, latestChannelHistoryEntry)) {
      const newCalculatedHourlyChannelView = addAMinuteToLastHourInHourlyChannelView(today);
      setCalculatedHourlyChannelView(newCalculatedHourlyChannelView);
    }
  }, ONE_MINUTE_MILLIS);

  const setVolume = async (direction: 'up' | 'down'): Promise<void> => {
    await fetch(`http://localhost:8080/api/v1/media/volume/${direction}`, {
      method: 'POST',
    });
  };

  const setTvUptime = (uptimeLog: UptimeLog) => {
    if (uptimeLog.turnOffTime) {
      setCalculatedTvUptime(
        formatUptime(
          moment(moment.unix(uptimeLog.turnOffTime).diff(moment.unix(uptimeLog.turnOnTime)))
            .subtract(1, 'hour')
            .format('H:m:')
        )
      );
    } else {
      setCalculatedTvUptime(
        formatUptime(
          moment(moment().diff(moment.unix(uptimeLog.turnOnTime)) - ONE_MINUTE_MILLIS * 60).format(
            'H:m:'
          )
        )
      );
    }
  };

  const setChannel = async (direction: 'next' | 'previous'): Promise<void> => {
    await fetch(`http://localhost:8080/api/v1/tv/channels/${direction}`, {
      method: 'POST',
    });
  };

  useEffect(() => {
    if (tvUptime) {
      setTvUptime(tvUptime);
    }
  }, [tvUptime]);

  setInterval(() => {
    if (tvUptime) {
      setTvUptime(tvUptime);
    }
  }, 1000 * 60);

  const {
    data: epgData,
    isLoading: isLoadingEpgData,
    isError: isEpgDataError,
  } = useEGP(softwareInfo ? (softwareInfo as any).country.toLowerCase() : 'hu');
  if (!isLoadingEpgData && !isEpgDataError) {
    dispatch(appActions.setEgpData(epgData));
  }

  return (
    <ApplicationLayout>
      <Grid>
        <Col span={12}>
          <Filter />
        </Col>
        <Col lg={6} xl={3}>
          <TvCard
            softwareInfo={softwareInfo}
            isLoadingSoftwareInfo={isLoadingSoftwareInfo}
            analogueTvChannelCount={analogueTvChannelCount}
            connectionStatus={connectionStatus}
            isLoadingChannelList={isLoadingChannelList}
            handleToggleTvState={handleToggleTvState}
            tvUptime={tvUptime}
            calculatedTvUptime={calculatedTvUptime}
            powerState={powerState}
            isLoadingPowerState={isLoadingPowerState}
            tvIp={tvIp}
            digitalTvChannelCount={digitalTvChannelCount}
            digitalRadioChannelCount={digitalRadioChannelCount}
            currentChannel={currentChannel}
            isLoadingTvStateToggle={isLoadingTvStateToggle}
            volume={volume}
            isLoadingVolume={isLoadingVolume}
            setVolume={setVolume}
            setChannel={setChannel}
          />
        </Col>
        <Col lg={6} xl={9}>
          <Grid>
            <Col lg={6}>
              {!calculatedChannelHistory && <Skeleton height="25vh" radius="xl" />}
              {calculatedChannelHistory && <RingStatistics data={calculatedChannelHistory} />}
            </Col>

            <Col lg={6}>
              {!calculatedChannelCategoryStats && <Skeleton height="25vh" radius="xl" />}
              {calculatedChannelCategoryStats && (
                <RingStatisticsChannelCategory data={calculatedChannelCategoryStats} />
              )}
            </Col>

            <Col lg={12}>
              <QuickAppLauncher />
            </Col>
            <Col lg={12}>
              <UptimeChart
                calculatedHourlyChannelView={calculatedHourlyChannelView}
                colorScheme={colorScheme}
                tvUptime={tvUptime}
              />
            </Col>
          </Grid>
        </Col>
      </Grid>
    </ApplicationLayout>
  );
};

export default DashboardPage;
