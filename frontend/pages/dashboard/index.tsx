import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Grid,
  Group,
  Image,
  Skeleton,
  Space,
  Text,
  Tooltip,
  Transition,
  useMantineColorScheme,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  IconCaretLeft,
  IconCaretRight,
  IconCheck,
  IconPlug,
  IconPlugOff,
  IconVolume,
  IconVolume2,
  IconX,
} from '@tabler/icons';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventSource from 'eventsource';
import moment from 'moment';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useViewportSize } from '@mantine/hooks';
import { tz } from 'moment-timezone';
import ApplicationLayout from '../../layouts/Application';
import { Channel } from '../../models/channel';
import { ChannelCategory } from '../../models/channel-category';
import { appActions, AppSliceState } from '../../store/app-slice';
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
import { ChannelHistory } from '../../models/channel-history';
import { RingStatistics } from '../../components/Statistics/RingStatistics';
import { RingStatisticsChannelCategory } from '../../components/Statistics/RingStatisticsChannelCategory';

const applications = [
  {
    name: 'YouTube',
    package: '',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
  },
  {
    name: 'Spotify',
    package: '',
    iconUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/991px-Spotify_icon.svg.png',
  },
  {
    name: 'Tidal',
    package: '',
    iconUrl: 'https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/tidal-512.png',
  },
  {
    name: 'Browser',
    package: '',
    iconUrl: 'https://www.freeiconspng.com/thumbs/www-icon/www-domain-icon-0.png',
  },
  {
    name: 'RTL+',
    package: '',
    iconUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/RTL%2B_Logo_2021.svg/2560px-RTL%2B_Logo_2021.svg.png',
  },
  {
    name: 'Twitch',
    package: '',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png',
  },
];

// Calculates that on a given day, how many minutes was the TV watched by every hour in 24 hours
const calculateHowManyMinutesWatchedInAGivenHour = (
  channelHistories: ChannelHistory[],
  day: Date
) => {
  const dayChannelHistories = channelHistories.filter(
    (channelHistory) => moment.unix(channelHistory.start).isSame(day, 'day') && channelHistory.end
  );

  const hours = new Array(24).fill(0);
  const timezone = tz.guess();

  dayChannelHistories.forEach((channelHistory) => {
    const startDate = tz(moment.unix(channelHistory.start), timezone);
    const startDateHour = startDate.hour();
    const endDate = tz(moment.unix(channelHistory.end), timezone);
    const endDateHour = endDate.hour();

    for (let i = startDateHour; i <= endDateHour; i += 1) {
      let duration: number;

      if (startDateHour === i) {
        duration = startDate.minute();
      } else if (endDateHour > startDateHour && i < endDateHour) {
        duration = 60 - startDate.hour(i).minute(0).minutes();
      } else {
        duration = endDate.minute();
      }

      hours[i] + duration > 60 ? (hours[i] = 60) : (hours[i] += duration);
    }
  });

  return hours;
};

const getHourLabel = (hour: number): string => {
  if (hour === 0 || hour === 24) {
    return '00:00 ';
  }

  if (hour < 10) {
    return `0${hour}:00 `;
  }

  return `${hour}:00 `;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length && payload[0].value > 0) {
    return (
      <Card>
        <span>
          <strong>{`${getHourLabel(label)} - ${getHourLabel(label + 1)}`}</strong>
        </span>
        <span>{`Up for ${payload[0].value} minutes`}</span>
      </Card>
    );
  }

  return null;
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

  const { height, width } = useViewportSize();
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
    channelList
  ) {
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
    dispatch(appActions.setChannelList(channelList));
  } //else if (typeof window !== 'undefined') {
  //router.replace('/error/missing-state-information');
  //}

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

  const setVolume = async (direction: 'up' | 'down'): Promise<void> => {
    await fetch(`http://localhost:8080/api/v1/media/volume/${direction}`, {
      method: 'POST',
    });
  };

  const setChannel = async (direction: 'next' | 'previous'): Promise<void> => {
    await fetch(`http://localhost:8080/api/v1/tv/channels/${direction}`, {
      method: 'POST',
    });
  };

  useEffect(() => {
    if (tvUptime) {
      if (tvUptime.turnOffTime) {
        setCalculatedTvUptime(
          formatUptime(
            moment(moment.unix(tvUptime.turnOffTime).diff(moment.unix(tvUptime.turnOnTime))).format(
              'H:m:'
            )
          )
        );
      } else {
        setCalculatedTvUptime(
          formatUptime(
            moment(moment().diff(moment.unix(tvUptime.turnOnTime)) - 1000 * 60 * 60).format('H:m:')
          )
        );
      }
    }
  }, [tvUptime]);

  setInterval(() => {
    if (tvUptime) {
      if (tvUptime.turnOffTime) {
        setCalculatedTvUptime(
          formatUptime(
            moment(moment.unix(tvUptime.turnOffTime).diff(moment.unix(tvUptime.turnOnTime))).format(
              'H:m:'
            )
          )
        );
      } else {
        setCalculatedTvUptime(
          formatUptime(
            moment(moment().diff(moment.unix(tvUptime.turnOnTime)) - 1000 * 60 * 60).format('H:m:')
          )
        );
      }
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
          <Card shadow="md" radius="xl" px={30} py={10}>
            Filters
          </Card>
        </Col>
        <Col lg={6} xl={3}>
          <Card style={{ height: '100%' }} shadow="md" radius="xl" px={30} pb={30}>
            <Image src="https://teleman.s3.eu-central-1.amazonaws.com/lg-tv-OLED42C24LA.png" />
            <Text weight="bold" size={20}>
              <Group spacing="sm">
                LG{' '}
                {softwareInfo && softwareInfo.model_name === 'HE_DTV_W22O_AFABATAA' ? 'C2' : 'TV'}{' '}
                {isLoadingPowerState && <Skeleton height={20} width="10%" radius="xl" />}
                {!isLoadingPowerState && (
                  <Badge
                    variant="gradient"
                    gradient={
                      !['Active Standby', 'Suspend'].includes(powerState.state)
                        ? { from: 'teal', to: 'lime', deg: 105 }
                        : { from: 'orange', to: 'red' }
                    }
                  >
                    {!['Active Standby', 'Suspend'].includes(powerState.state) ? 'On' : 'Off'}
                  </Badge>
                )}
              </Group>
            </Text>
            <Space h="xs" />
            <Text weight="normal">
              {isLoadingSoftwareInfo && <Skeleton height={12} mt={6} width="25%" />}
              {!isLoadingSoftwareInfo && softwareInfo && (softwareInfo as any).product_name}
            </Text>
            <Space h="md" />
            <Text>
              <Group position="apart">
                <Text weight={500}>MAC Address</Text>
                {!softwareInfo && <Skeleton height={12} mt={6} width="30%" />}
                {softwareInfo && <Text>{softwareInfo.device_id}</Text>}
              </Group>
            </Text>
            <Space h="sm" />
            <Text>
              <Group position="apart">
                <Text weight={500}>LAN IP</Text>
                {!tvIp && <Skeleton height={12} mt={6} width="30%" />}
                {tvIp && <Text>{tvIp.ip}</Text>}
              </Group>
            </Text>
            <Divider my="sm" />
            <Text>
              <Group position="apart">
                <Text weight={500}>TV Uptime</Text>
                {!tvUptime && <Skeleton height={12} mb={6} width="20%" />}
                {tvUptime && (
                  <Text>
                    <Tooltip
                      label={
                        !tvUptime.turnOffTime
                          ? moment.unix(tvUptime.turnOnTime).format('YYYY. MM. DD. HH:mm:ss')
                          : `${moment
                              .unix(tvUptime.turnOnTime)
                              .format('YYYY. MM. DD. HH:mm:ss')} - ${moment
                              .unix(tvUptime.turnOffTime)
                              .format('YYYY. MM. DD. HH:mm:ss')}`
                      }
                    >
                      <span>{calculatedTvUptime}</span>
                    </Tooltip>
                  </Text>
                )}
              </Group>
            </Text>
            <Space h="sm" />
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
                {isLoadingChannelList && <Skeleton height={12} mb={6} width="10%" />}
                {!isLoadingChannelList && <Text>{digitalTvChannelCount}</Text>}
              </Group>
            </Text>
            <Space h="sm" />
            <Text>
              <Group position="apart">
                <Text weight={500}>Analogue TV Channels</Text>
                {isLoadingChannelList && <Skeleton height={12} mb={6} width="10%" />}
                {!isLoadingChannelList && <Text>{analogueTvChannelCount}</Text>}
              </Group>
            </Text>
            <Space h="sm" />
            <Text>
              <Group position="apart">
                <Text weight={500}>Radio Channels</Text>
                {isLoadingChannelList && <Skeleton height={12} mb={6} width="10%" />}
                {!isLoadingChannelList && <Text>{digitalRadioChannelCount}</Text>}
              </Group>
            </Text>
            <Divider my="sm" />
            <Text>
              <Group noWrap position="apart">
                <Text weight={500} lineClamp={1}>
                  <Text>
                    {currentChannel && currentChannel.channelName
                      ? 'Current Channel'
                      : 'Current Application'}
                  </Text>
                </Text>
                {!currentChannel && <Skeleton height={12} mt={6} width="30%" />}
                {typeof currentChannel !== 'undefined' && (
                  <Text>
                    {currentChannel.channelName && (
                      <Tooltip label={currentChannel && currentChannel.channelName}>
                        <Text lineClamp={1}>{currentChannel.channelName}</Text>
                      </Tooltip>
                    )}
                    {currentChannel.application && (
                      <Tooltip label={currentChannel && currentChannel.application}>
                        <Text lineClamp={1}>{currentChannel.application}</Text>
                      </Tooltip>
                    )}
                  </Text>
                )}
              </Group>
            </Text>
            <Space h="sm" />
            <Text>
              <Group position="apart">
                <Text weight={500}>Current Volume</Text>
                {isLoadingVolume && <Skeleton height={12} mt={6} width="7%" />}
                {!isLoadingVolume && <Text>{volume.volumeStatus.volume}</Text>}
              </Group>
            </Text>
            <Space h="lg" />
            <Grid align="center">
              <Col span={6}>
                <Tooltip label="Volume Down">
                  <Text align="left">
                    <Button
                      onClick={() => setVolume('down')}
                      disabled={
                        !(
                          !isLoadingPowerState &&
                          !['Active Standby', 'Suspend'].includes(powerState.state)
                        )
                      }
                      fullWidth
                      leftIcon={<IconVolume2 size={20} />}
                      variant="light"
                      radius="xl"
                    >
                      Volume Down
                    </Button>
                  </Text>
                </Tooltip>
              </Col>
              <Col span={6}>
                <Tooltip label="Volume Up">
                  <Text align="right">
                    <Button
                      onClick={() => setVolume('up')}
                      disabled={
                        !(
                          !isLoadingPowerState &&
                          !['Active Standby', 'Suspend'].includes(powerState.state)
                        )
                      }
                      fullWidth
                      leftIcon={<IconVolume size={20} />}
                      variant="light"
                      radius="xl"
                    >
                      Volume Up
                    </Button>
                  </Text>
                </Tooltip>
              </Col>
              <Col span={6}>
                <Tooltip label="Previous Channel">
                  <Text align="left">
                    <Button
                      onClick={() => setChannel('previous')}
                      disabled={
                        !(
                          !isLoadingPowerState &&
                          !['Active Standby', 'Suspend'].includes(powerState.state)
                        )
                      }
                      fullWidth
                      leftIcon={<IconCaretLeft size={26} />}
                      variant="light"
                      radius="xl"
                    >
                      Previous Channel
                    </Button>
                  </Text>
                </Tooltip>
              </Col>
              <Col span={6}>
                <Tooltip label="Next Channel">
                  <Text align="right">
                    <Button
                      onClick={() => setChannel('next')}
                      disabled={
                        !(
                          !isLoadingPowerState &&
                          !['Active Standby', 'Suspend'].includes(powerState.state)
                        )
                      }
                      fullWidth
                      leftIcon={<IconCaretRight size={26} />}
                      variant="light"
                      radius="xl"
                    >
                      Next Channel
                    </Button>
                  </Text>
                </Tooltip>
              </Col>
            </Grid>
            <Space h="xl" />
            <Group>
              <Transition mounted transition="fade" duration={400} timingFunction="ease">
                {(styles) => (
                  <Button
                    style={styles}
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
                    radius="xl"
                    gradient={
                      !isLoadingPowerState &&
                      !['Active Standby', 'Suspend'].includes(powerState.state)
                        ? { from: 'orange', to: 'red' }
                        : { from: 'teal', to: 'lime', deg: 105 }
                    }
                  >
                    Turn{' '}
                    {!isLoadingPowerState &&
                    !['Active Standby', 'Suspend'].includes(powerState.state)
                      ? 'Off'
                      : 'On'}
                  </Button>
                )}
              </Transition>
            </Group>
          </Card>
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
                <RingStatisticsChannelCategory data={calculatedChannelCategoryStats as any} />
              )}
            </Col>

            <Col lg={12}>
              <Card style={{ minHeight: '25.5vh' }} shadow="md" radius="xl" p="xs">
                <Text mt={6} ml={12} weight={500}>
                  Quick App Launch
                </Text>
                <Grid columns={4} p={20}>
                  {applications.map((application) => (
                    <Col lg={1} p={20}>
                      <Card
                        withBorder
                        style={{ height: '9vh', cursor: 'pointer' }}
                        radius="lg"
                        shadow="sm"
                      >
                        <Group px={20} pb={10} position="apart" style={{ height: '100%' }}>
                          <Image width="2.5vw" alt={application.name} src={application.iconUrl} />
                          <Text weight={500}>{application.name}</Text>
                        </Group>
                      </Card>
                    </Col>
                  ))}
                </Grid>
              </Card>
            </Col>

            <Col lg={12}>
              <Card style={{ minHeight: '30vh' }} shadow="md" radius="xl" p="xs">
                <Text mt={6} ml={12} weight={500}>
                  Uptime Overview
                </Text>
                <Space h="xs" />
                {(!calculatedHourlyChannelView ||
                  (calculatedHourlyChannelView &&
                    calculatedHourlyChannelView
                      .map((stat: any) => stat.minutes)
                      .reduce((acc: number, curr: number) => acc + curr, 0) === 0)) && (
                  <Group align="flex-end" position="center" p={20}>
                    <Skeleton animate={false} height="20vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="11vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="14vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="17vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="12vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="10vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="10vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="15vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="15vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="15vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="13vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="11vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="14vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="17vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="14vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="12vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="10vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="13vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="13vh" width="1.5vw" radius="xl" />
                    <Skeleton animate={false} height="13vh" width="1.5vw" radius="xl" />
                    {width > 1800 && (
                      <>
                        <Skeleton animate={false} height="11vh" width="1.5vw" radius="xl" />
                        <Skeleton animate={false} height="9vh" width="1.5vw" radius="xl" />
                        <Skeleton animate={false} height="7vh" width="1.5vw" radius="xl" />
                        <Skeleton animate={false} height="10vh" width="1.5vw" radius="xl" />
                      </>
                    )}
                  </Group>
                )}
                {calculatedHourlyChannelView &&
                  calculatedHourlyChannelView
                    .map((stat: any) => stat.minutes)
                    .reduce((acc: number, curr: number) => acc + curr, 0) > 0 && (
                    <>
                      <Text mt={2} ml={12} weight={400}>
                        {tvUptime && (
                          <span>
                            {calculatedHourlyChannelView &&
                            calculatedHourlyChannelView
                              .map((stat: any) => stat.minutes)
                              .reduce((acc: number, curr: number) => acc + curr, 0) > 0
                              ? `${moment
                                  .duration(
                                    calculatedHourlyChannelView
                                      .map((stat: any) => stat.minutes)
                                      .reduce((acc: number, curr: number) => acc + curr, 0),
                                    'minutes'
                                  )
                                  .humanize()} `
                              : `${0} hours `}
                            today
                          </span>
                        )}
                      </Text>
                      <ResponsiveContainer width="99%" height={305}>
                        <BarChart
                          width={1580}
                          height={295}
                          data={calculatedHourlyChannelView}
                          margin={{ top: 50, left: 10, right: 35, bottom: 40 }}
                        >
                          <defs>
                            {colorScheme.colorScheme === 'light' && (
                              <linearGradient id="colorUv" x1="0.15" y1="0.85" x2="0.85" y2="0.15">
                                <stop offset="0%" stopColor="#ac6ce4" />
                                <stop offset="8.33%" stopColor="#a769e4" />
                                <stop offset="16.67%" stopColor="#a266e4" />
                                <stop offset="25%" stopColor="#9d62e4" />
                                <stop offset="33.33%" stopColor="#975fe4" />
                                <stop offset="41.67%" stopColor="#915de4" />
                                <stop offset="50%" stopColor="#8b5ae4" />
                                <stop offset="58.33%" stopColor="#8557e5" />
                                <stop offset="66.67%" stopColor="#7d55e5" />
                                <stop offset="75%" stopColor="#7652e5" />
                                <stop offset="83.33%" stopColor="#6d50e5" />
                                <stop offset="100%" stopColor="#594ce6" />
                              </linearGradient>
                            )}
                            {colorScheme.colorScheme === 'dark' && (
                              <linearGradient id="colorUv" x1="0.15" y1="0.85" x2="0.85" y2="0.15">
                                <stop offset="0%" stopColor="#873dc7" />
                                <stop offset="8.33%" stopColor="#833cc7" />
                                <stop offset="16.67%" stopColor="#7f3cc6" />
                                <stop offset="25%" stopColor="#7a3cc6" />
                                <stop offset="33.33%" stopColor="#763bc6" />
                                <stop offset="41.67%" stopColor="#713bc6" />
                                <stop offset="50%" stopColor="#6c3ac6" />
                                <stop offset="58.33%" stopColor="#673ac6" />
                                <stop offset="66.67%" stopColor="#6139c6" />
                                <stop offset="75%" stopColor="#5b39c6" />
                                <stop offset="83.33%" stopColor="#5539c7" />
                                <stop offset="100%" stopColor="#4539c6" />
                              </linearGradient>
                            )}
                          </defs>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="hour"
                            tickCount={10}
                            interval={2}
                            domain={[0, 23]}
                            strokeDasharray="1 1"
                            fontFamily="Poppins"
                            fontWeight={500}
                          />
                          <YAxis
                            domain={[0, 60]}
                            strokeDasharray="1 1"
                            fontFamily="Poppins"
                            fontWeight={500}
                          />
                          <ChartTooltip
                            wrapperStyle={{ outline: 'none' }}
                            allowEscapeViewBox={{ x: false, y: false }}
                            isAnimationActive={false}
                            cursor={{
                              fill: colorScheme.colorScheme === 'light' ? '#E9ECEF' : '#373B41',
                            }}
                            content={<CustomTooltip />}
                          />
                          <Bar
                            dataKey="minutes"
                            radius={24}
                            fill="url(#colorUv)"
                            className="uptime-chart-bar"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  )}
              </Card>
            </Col>
          </Grid>
        </Col>
      </Grid>
    </ApplicationLayout>
  );
};

export default DashboardPage;
