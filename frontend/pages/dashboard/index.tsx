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
  Card,
  useMantineTheme,
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
import { useRouter } from 'next/router';
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
  useEGP,
} from '../../hooks';
import { ChannelHistory } from '../../models/channel-history';
import { RingStatistics } from '../../components/Statistics/RingStatistics';
import { RingStatisticsChannelCategory } from '../../components/Statistics/RingStatisticsChannelCategory';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
} from 'recharts';

// Calculates that on a given day, how many minutes was the TV watched by every hour in 24 hours
const calculateHowManyMinutesWatchedInAGivenHour = (
  channelHistories: ChannelHistory[],
  day: Date
) => {
  const dayChannelHistories = channelHistories.filter(
    (channelHistory) => moment.unix(channelHistory.start).isSame(day, 'day') && channelHistory.end
  );

  const hours = new Array(24).fill(0);

  dayChannelHistories.forEach((channelHistory) => {
    const hour = moment.unix(channelHistory.start).hour();
    hours[hour] = hours[hour] + channelHistory.start;
  });

  const result = hours.map((hour) => moment.unix(hour).minutes());
  console.log(result);
  return result;
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
        <span>{`Watched for ${payload[0].value} minutes`}</span>
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
      watchTime: number;
    }[]
  >();
  const [calculatedHourlyChannelView, setCalculatedHourlyChannelView] = React.useState<any>();

  const colorScheme = useMantineColorScheme();
  const router = useRouter();
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
    textToFormat.replace(':', 'h ').replace(':', 'm ');

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
    setCalculatedChannelCategoryStats(watchTimeByCategory);
  }, [channelHistory]);

  useEffect(() => {
    if (!channelHistory) return;
    const statistics = [];
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 12);
    console.log(yesterday);

    const result = calculateHowManyMinutesWatchedInAGivenHour(channelHistory, yesterday);
    const formattedResult = result.map((item, index) => {
      return {
        hour: index,
        minutes: item,
      };
    });

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

  const {
    data: epgData,
    isLoading: isLoadingEpgData,
    isError: isEpgDataError,
  } = useEGP(softwareInfo ? softwareInfo.country.toLowerCase() : 'hu');
  if (!isLoadingEpgData && !isEpgDataError) {
    dispatch(appActions.setEgpData(epgData));
  }

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
          formatUptime(moment(moment().diff(moment.unix(tvUptime.turnOnTime))).format('H:m:'))
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
          formatUptime(moment(moment().diff(moment.unix(tvUptime.turnOnTime))).format('H:m:'))
        );
      }
    }
  }, 1000 * 60);

  return (
    <ApplicationLayout>
      <Grid>
        <Col lg={6} xl={3}>
          <Paper withBorder style={{ minHeight: '93vh' }} radius="md" px={30} pb={30}>
            <Image src="https://teleman.s3.eu-central-1.amazonaws.com/lg-tv-OLED42C24LA.png" />
            <Text weight="bold" size={20}>
              <Group spacing="xs">
                LG{' '}
                {softwareInfo && softwareInfo.model_name === 'HE_DTV_W22O_AFABATAA' ? 'C2' : 'TV'}{' '}
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
                  {tvUptime && (
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
                  )}
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
              <Group noWrap position="apart">
                <Text weight={500} lineClamp={1}>
                  <Tooltip label="Current Channel">
                    <Text>Current Channel</Text>
                  </Tooltip>
                </Text>
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
            <Grid align="center">
              <Col span={6}>
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
                    variant="outline"
                  >
                    Volume Down
                  </Button>
                </Text>
              </Col>
              <Col span={6}>
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
                    variant="outline"
                  >
                    Volume Up
                  </Button>
                </Text>
              </Col>
              <Col span={6}>
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
                    variant="outline"
                  >
                    Previous Channel
                  </Button>
                </Text>
              </Col>
              <Col span={6}>
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
                    variant="outline"
                  >
                    Next Channel
                  </Button>
                </Text>
              </Col>
            </Grid>
            <Space h="xl" />
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

        <Col lg={6} xl={9}>
          <Grid>
            <Col lg={6}>
              {calculatedChannelHistory && <RingStatistics data={calculatedChannelHistory} />}
            </Col>

            <Col lg={6}>
              {calculatedChannelCategoryStats && (
                <RingStatisticsChannelCategory data={calculatedChannelCategoryStats as any} />
              )}
            </Col>

            <Col lg={12}>
              <Paper withBorder style={{ minHeight: '27vh' }} radius="md" p="xs">
                <Text mt={6} ml={12} weight={500}>
                  Quick App Launch
                </Text>
                <Grid columns={4}>
                  {[].map((application) => (
                    <Col lg={1}>
                      <Card>{application}</Card>
                    </Col>
                  ))}
                </Grid>
              </Paper>
            </Col>

            <Col lg={12}>
              <Paper withBorder style={{ minHeight: '38.33vh' }} radius="md" p="xs">
                <Text mt={6} ml={12} weight={500}>
                  Uptime Overview
                </Text>
                <Text mt={2} ml={12} weight={400}>
                  <span>
                    {calculatedHourlyChannelView &&
                    calculatedHourlyChannelView
                      .map((stat: any) => stat.minutes)
                      .reduce((acc: number, curr: number) => acc + curr, 0) > 0
                      ? moment
                          .duration(
                            calculatedHourlyChannelView
                              .map((stat: any) => stat.minutes)
                              .reduce((acc: number, curr: number) => acc + curr, 0),
                            'minutes'
                          )
                          .humanize() + ' '
                      : 0 + 'hours'}
                    today
                  </span>
                </Text>
                <ResponsiveContainer width={'99%'} height={400}>
                  <BarChart
                    width={1580}
                    height={400}
                    data={calculatedHourlyChannelView}
                    margin={{ top: 30, right: 30 }}
                  >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis dataKey="hour" tickCount={10} domain={[0, 23]} strokeDasharray="2 2" />
                    <YAxis tickCount={7} domain={[0, 60]} strokeDasharray="2 2" />
                    <ChartTooltip
                      wrapperStyle={{ outline: 'none' }}
                      allowEscapeViewBox={{ x: false, y: false }}
                      isAnimationActive={false}
                      cursor={{ fill: colorScheme.colorScheme === 'light' ? '#E9ECEF' : '#373B41' }}
                      content={<CustomTooltip />}
                    />
                    <Bar dataKey="minutes" fill="#584AE3" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Col>
          </Grid>
        </Col>
      </Grid>
    </ApplicationLayout>
  );
};

export default DashboardPage;
