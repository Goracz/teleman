import moment from 'moment';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Col, Grid, Skeleton, useMantineColorScheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

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
  useSetChannel,
  useSetVolume,
  useSoftwareInformation,
  useSystemPower,
  useTvIp,
  useUptime,
  useVolume,
} from '../../hooks';
import {
  useAnalogueTvChannelCount,
  useConnectionStatus,
  useDigitalRadioChannelCount,
  useDigitalTvChannelCount,
} from '../../hooks/dashboard';
import ApplicationLayout from '../../layouts/Application';
import { Channel } from '../../models/channel';
import { ChannelCategory } from '../../models/channel-category';
import { ChannelHistory } from '../../models/channel-history';
import { PowerState } from '../../models/power-state-change';
import { UptimeLog } from '../../models/uptime-log';
import { appActions } from '../../store/app-slice';
import {
  addAMinuteToLastHourInHourlyChannelView,
  calculateHowManyMinutesWatchedInAGivenHour,
} from '../../utils/dashboard';

const ONE_MINUTE_MILLIS = 1000 * 60;

export const DashboardPage: NextPage = () => {
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
  const connectionStatus = useConnectionStatus();
  const digitalTvChannelCount = useDigitalTvChannelCount();
  const analogueTvChannelCount = useAnalogueTvChannelCount();
  const digitalRadioChannelCount = useDigitalRadioChannelCount();

  let isLoadingTvStateToggle = false;
  let isTvStateToggleError = false;

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

  setInterval(() => {
    // If the TV is still turned on (the latest channel history entry does not have an end),
    // add plus one minute to the current hour in calculated hourly channel view without recalculating the whole thing
    if (shouldNotUptimeChartBeUpdated()) return;

    const latestChannelHistoryEntry = channelHistory[channelHistory.length - 1];
    const today = new Date();
    if (isLatestChannelHistoryWithoutEndDate(today, latestChannelHistoryEntry)) {
      const newCalculatedHourlyChannelView = addAMinuteToLastHourInHourlyChannelView(
        today,
        channelHistory
      );
      setCalculatedHourlyChannelView(newCalculatedHourlyChannelView);
    }
  }, ONE_MINUTE_MILLIS);

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
            setVolume={useSetVolume}
            setChannel={useSetChannel}
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
