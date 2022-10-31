import {
  Col,
  Grid,
  Image,
  Skeleton,
  Text,
  Space,
  Group,
  Divider,
  Paper,
  Button,
  Badge,
  Tooltip,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconPlug, IconPlugOff, IconX } from '@tabler/icons';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventSource from 'eventsource';
import moment from 'moment';
import { RingStatisticsDemo } from '../../components/Statistics/RingStatisticsDemo';
import ApplicationLayout from '../../layouts/Application';
import { Channel } from '../../models/channel';
import { ChannelCategory } from '../../models/channel-category';
import { appActions, AppSliceState } from '../../store/app-slice';
import {
  useUptime,
  useChannels,
  useCurrentChannel,
  useSoftwareInformation,
  useSystemPower,
  useVolume,
  useChannelHistory,
} from '../../hooks';
import { ChannelHistory } from '../../models/channel-history';
import { RingStatistics } from '../../components/Statistics/RingStatistics';

const DashboardPage: NextPage = () => {
  const ringProgressData = [
    {
      label: 'Channels by category',
      stats: '10',
      progress: 43,
      color: 'teal',
      icon: 'up',
    },
  ];

  const [calculatedTvUptime, setCalculatedTvUptime] = React.useState<string>('-');
  const [calculatedChannelHistory, setCalculatedChannelHistory] = React.useState<
    {
      channelName: string;
      channelCategory: ChannelCategory;
      channelLogoUrl: string;
      watchTime: number;
    }[]
  >();

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
  if (!isLoadingChannelList && !isChannelsError) {
    dispatch(appActions.setChannelList(channelList));

    dispatch(
      appActions.setDigitalTvChannelCount(
        channelList.channelList.filter(
          (channel: Channel) => channel.channelType === 'Cable Digital TV'
        ).length
      )
    );
    dispatch(
      appActions.setAnalogueTvChannelCount(
        channelList.channelList.filter(
          (channel: Channel) => channel.channelType === 'Cable Analogue TV'
        ).length
      )
    );
    dispatch(
      appActions.setDigitalRadioChannelCount(
        channelList.channelList.filter(
          (channel: Channel) => channel.channelType === 'Cable Digital Radio'
        ).length
      )
    );
  }

  const {
    data: softwareInfo,
    isLoading: isLoadingSoftwareInfo,
    isError: isSoftwareInfoError,
  } = useSoftwareInformation();
  if (!isLoadingSoftwareInfo && !isSoftwareInfoError) {
    dispatch(appActions.setSoftwareInfo(softwareInfo));
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
    const desiredState: 'on' | 'off' = !['Active Standby', 'Suspend'].includes(powerState.state)
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

  const formatUptime = (textToFormat: string): string => {
    let formattedText = textToFormat;
    formattedText = textToFormat.replace(':', 'h ').replace(':', 'm ');

    return formattedText;
  };

  useEffect(() => {
    useChannelHistory(new Date('2022-10-01'), new Date('2022-10-31')).then((data) => {
      const groupedData = data.reduce((r, a) => {
        // eslint-disable-next-line no-param-reassign
        r[a.channelName] = [...(r[a.channelName] || []), a];
        return r;
      }, Object.create(null));

      const watchTimeByChannel = Object.keys(groupedData).map((key) => {
        const channelHistory = groupedData[key] as ChannelHistory[];
        const { channelCategory, channelLogoUrl } = channelHistory[0];
        const watchTime = channelHistory.reduce(
          (a, b) => a + (moment.unix(b.end).diff(moment.unix(b.start)) || 0),
          0
        );
        return {
          channelName: key,
          channelCategory,
          channelLogoUrl,
          watchTime,
        };
      });
      setCalculatedChannelHistory(watchTimeByChannel);
    });
  }, []);

  useEffect(() => {
    if (!tvUptime) return;
    setCalculatedTvUptime(
      formatUptime(moment(moment().diff(moment.unix(tvUptime.turnOnTime))).format('H:m:'))
    );
  }, [tvUptime]);

  setInterval(() => {
    if (tvUptime) {
      if (tvUptime.turnOffTime) {
        formatUptime(
          moment(moment.unix(tvUptime.turnOffTime).diff(moment.unix(tvUptime.turnOnTime))).format(
            'H:m:'
          )
        );
      } else {
        setCalculatedTvUptime(
          formatUptime(moment(moment().diff(moment.unix(tvUptime.turnOnTime))).format('H:m:'))
        );
      }
    }
  }, 1000 * 60);

  return (
    <ApplicationLayout>
      <Grid>
        <Col lg={2}>
          <Paper withBorder radius="md" px={30} pb={30}>
            <Image src="https://www.lg.com/hu/images/televiziok/md07546714/gallery/lg-tv-OLED42C24LA-medium01.jpg" />
            <Text weight="bold" size={20}>
              <Group spacing="xs">
                LG C2{' '}
                <Badge
                  variant="gradient"
                  gradient={
                    !isLoadingPowerState &&
                    !['Active Standby', 'Suspend'].includes(powerState.state)
                      ? { from: 'teal', to: 'lime', deg: 105 }
                      : { from: 'orange', to: 'red' }
                  }
                >
                  {!isLoadingPowerState && !['Active Standby', 'Suspend'].includes(powerState.state)
                    ? 'On'
                    : 'Off'}
                </Badge>
              </Group>
            </Text>
            <Text weight="normal">
              {isLoadingSoftwareInfo && <Skeleton height={12} mt={6} width="40%" />}
              {!isLoadingSoftwareInfo && softwareInfo && (softwareInfo as any).product_name}
            </Text>
            <Space h="md" />
            <Text>
              <Group position="apart">
                <Text weight={500}>LAN IP</Text>
                <Text>192.168.1.246</Text>
              </Group>
            </Text>
            <Divider my="sm" />
            <Text>
              <Group position="apart">
                <Text weight={500}>TV Uptime</Text>
                <Text>
                  <Tooltip
                    label={
                      tvUptime && moment.unix(tvUptime.turnOnTime).format('YYYY. MM. DD. HH:mm:ss')
                    }
                  >
                    <span>{calculatedTvUptime}</span>
                  </Tooltip>
                </Text>
              </Group>
            </Text>
            <Space h="xs" />
            <Text>
              <Group position="apart">
                <Text weight={500}>System Uptime</Text>
                <Text>-</Text>
              </Group>
            </Text>
            <Divider my="sm" />
            <Text>
              <Group position="apart">
                <Text weight={500}>Digital TV Channels</Text>
                <Text>
                  {isLoadingChannelList && <Skeleton height={12} mt={6} width="20%" />}
                  {!isLoadingChannelList && digitalTvChannelCount}
                </Text>
              </Group>
            </Text>
            <Space h="xs" />
            <Text>
              <Group position="apart">
                <Text weight={500}>Analogue TV Channels</Text>
                <Text>
                  {isLoadingChannelList && <Skeleton height={12} mt={6} width="20%" />}
                  {!isLoadingChannelList && analogueTvChannelCount}
                </Text>
              </Group>
            </Text>
            <Space h="xs" />
            <Text>
              <Group position="apart">
                <Text weight={500}>Radio Channels</Text>
                <Text>
                  {isLoadingChannelList && <Skeleton height={12} mt={6} width="20%" />}
                  {!isLoadingChannelList && digitalRadioChannelCount}
                </Text>
              </Group>
            </Text>
            <Divider my="sm" />
            <Text>
              <Group position="apart">
                <Text weight={500}>Current Channel</Text>
                <Text>
                  {!currentChannel && <Skeleton height={12} mt={6} width="20%" />}

                  {typeof currentChannel !== 'undefined' && (
                    <Tooltip label={currentChannel && currentChannel.channelName}>
                      <Text lineClamp={1}>{currentChannel.channelName}</Text>
                    </Tooltip>
                  )}
                </Text>
              </Group>
            </Text>
            <Space h="xs" />
            <Text>
              <Group position="apart">
                <Text weight={500}>Current Volume</Text>
                <Text>
                  {isLoadingVolume && <Skeleton height={12} mt={6} width="20%" />}

                  {!isLoadingVolume && volume.volumeStatus.volume}
                </Text>
              </Group>
            </Text>
            <Space h="lg" />
            <Group>
              <Button
                leftIcon={
                  !isLoadingPowerState &&
                  !['Active Standby', 'Suspend'].includes(powerState.state) ? (
                    <IconPlugOff size={16} />
                  ) : (
                    <IconPlug size={16} />
                  )
                }
                loading={isLoadingTvStateToggle}
                disabled={connectionStatus === EventSource.OPEN}
                onClick={handleToggleTvState}
                fullWidth
                variant="gradient"
                gradient={
                  !isLoadingPowerState && !['Active Standby', 'Suspend'].includes(powerState.state)
                    ? { from: 'orange', to: 'red' }
                    : { from: 'teal', to: 'lime', deg: 105 }
                }
              >
                Turn{' '}
                {!isLoadingPowerState && !['Active Standby', 'Suspend'].includes(powerState.state)
                  ? 'Off'
                  : 'On'}
              </Button>
            </Group>
          </Paper>
        </Col>

        <Col lg={5}>
          {calculatedChannelHistory && <RingStatistics data={calculatedChannelHistory} />}
        </Col>

        <Col lg={5}>
          <RingStatisticsDemo data={ringProgressData as any} />
        </Col>
      </Grid>
    </ApplicationLayout>
  );
};

export default DashboardPage;
