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
} from '@mantine/core';
import moment from 'moment/moment';
import {
  IconArrowBack,
  IconArrowBackUp,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconCaretLeft,
  IconCaretRight,
  IconPlug,
  IconPlugOff,
  IconVolume,
  IconVolume2,
} from '@tabler/icons';
import EventSource from 'eventsource';
import React, { memo } from 'react';
import { Volume } from '../../models/volume';
import { PowerState } from '../../models/power-state';
import { Channel } from '../../models/channel';

export interface TvCardProps {
  softwareInfo: any;
  isLoadingSoftwareInfo: boolean;
  powerState: PowerState;
  isLoadingPowerState: boolean;
  tvIp: { ip: string };
  tvUptime: any;
  isLoadingChannelList: boolean;
  calculatedTvUptime: string;
  digitalTvChannelCount: number;
  analogueTvChannelCount: number;
  digitalRadioChannelCount: number;
  currentChannel: Channel;
  isLoadingTvStateToggle: boolean;
  connectionStatus: EventSource.ReadyState;
  handleToggleTvState: () => void;
  volume: Volume;
  isLoadingVolume: boolean;
  setVolume: (volume: 'up' | 'down') => void;
  setChannel: (channel: 'previous' | 'next') => void;
}

const TvCard = memo(
  ({
    softwareInfo,
    isLoadingSoftwareInfo,
    powerState,
    isLoadingPowerState,
    tvIp,
    tvUptime,
    isLoadingChannelList,
    calculatedTvUptime,
    digitalTvChannelCount,
    analogueTvChannelCount,
    digitalRadioChannelCount,
    currentChannel,
    isLoadingTvStateToggle,
    connectionStatus,
    handleToggleTvState,
    volume,
    isLoadingVolume,
    setVolume,
    setChannel,
  }: TvCardProps) => (
    <Card style={{ height: '100%' }} shadow="md" radius="xl" px={30} pb={30}>
      <Image src="https://teleman.s3.eu-central-1.amazonaws.com/lg-tv-OLED42C24LA.png" />
      <Text weight="bold" size={20}>
        <Group spacing="sm">
          LG {softwareInfo && softwareInfo.model_name === 'HE_DTV_W22O_AFABATAA' ? 'C2' : 'TV'}{' '}
          {isLoadingPowerState && <Skeleton height={20} width="10%" radius="xl" />}
          {!isLoadingPowerState && powerState && (
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
              {(currentChannel as any).application && (
                <Tooltip label={currentChannel && (currentChannel as any).application}>
                  <Text lineClamp={1}>{(currentChannel as any).application}</Text>
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
          <Tooltip label="Return">
            <Text align="left">
              <Button
                onClick={() => setVolume('down')}
                disabled={
                  !(
                    !isLoadingPowerState &&
                    powerState &&
                    !['Active Standby', 'Suspend'].includes(powerState.state)
                  )
                }
                leftIcon={<IconArrowBackUp size={20} />}
                fullWidth
                variant="light"
                radius="xl"
              >
                Return
              </Button>
            </Text>
          </Tooltip>
        </Col>
        <Col span={6}>
          <Tooltip label="Enter">
            <Text align="left">
              <Button
                onClick={() => setVolume('down')}
                disabled={
                  !(
                    !isLoadingPowerState &&
                    powerState &&
                    !['Active Standby', 'Suspend'].includes(powerState.state)
                  )
                }
                leftIcon={<IconArrowBack size={20} />}
                fullWidth
                variant="light"
                radius="xl"
              >
                Enter
              </Button>
            </Text>
          </Tooltip>
        </Col>
        <Col span={3}>
          <Tooltip label="Up">
            <Text align="left">
              <Button
                onClick={() => setVolume('down')}
                disabled={
                  !(
                    !isLoadingPowerState &&
                    powerState &&
                    !['Active Standby', 'Suspend'].includes(powerState.state)
                  )
                }
                fullWidth
                variant="light"
                radius="xl"
              >
                <IconArrowUp size={20} />
              </Button>
            </Text>
          </Tooltip>
        </Col>
        <Col span={3}>
          <Tooltip label="Down">
            <Text align="left">
              <Button
                onClick={() => setVolume('down')}
                disabled={
                  !(
                    !isLoadingPowerState &&
                    powerState &&
                    !['Active Standby', 'Suspend'].includes(powerState.state)
                  )
                }
                fullWidth
                variant="light"
                radius="xl"
              >
                <IconArrowDown size={20} />
              </Button>
            </Text>
          </Tooltip>
        </Col>
        <Col span={3}>
          <Tooltip label="Left">
            <Text align="left">
              <Button
                onClick={() => setVolume('down')}
                disabled={
                  !(
                    !isLoadingPowerState &&
                    powerState &&
                    !['Active Standby', 'Suspend'].includes(powerState.state)
                  )
                }
                fullWidth
                variant="light"
                radius="xl"
              >
                <IconArrowLeft size={20} />
              </Button>
            </Text>
          </Tooltip>
        </Col>
        <Col span={3}>
          <Tooltip label="Right">
            <Text align="left">
              <Button
                onClick={() => setVolume('down')}
                disabled={
                  !(
                    !isLoadingPowerState &&
                    powerState &&
                    !['Active Standby', 'Suspend'].includes(powerState.state)
                  )
                }
                fullWidth
                variant="light"
                radius="xl"
              >
                <IconArrowRight size={20} />
              </Button>
            </Text>
          </Tooltip>
        </Col>
        <Col span={6}>
          <Tooltip label="Volume Down">
            <Text align="left">
              <Button
                onClick={() => setVolume('down')}
                disabled={
                  !(
                    !isLoadingPowerState &&
                    powerState &&
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
                    powerState &&
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
                    powerState &&
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
                    powerState &&
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
                powerState &&
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
                powerState &&
                !['Active Standby', 'Suspend'].includes(powerState.state)
                  ? { from: 'orange', to: 'red' }
                  : { from: 'teal', to: 'lime', deg: 105 }
              }
            >
              Turn{' '}
              {!isLoadingPowerState &&
              powerState &&
              !['Active Standby', 'Suspend'].includes(powerState.state)
                ? 'Off'
                : 'On'}
            </Button>
          )}
        </Transition>
      </Group>
    </Card>
  )
);

export default TvCard;
