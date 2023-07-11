import { useSelector } from 'react-redux';

import { useQuery } from '@tanstack/react-query';

import { Constants } from '../constants/constants';
import { Channel } from '../models/tv/channel/channel';
import { ChannelHistory } from '../models/tv/channel/channel-history';
import { Volume } from '../models/tv/media/volume';
import { PowerStateChange } from '../models/tv/power-state/power-state-change';
import { LaunchPoint } from '../models/tv/system/launch-point';
import { AppSliceState } from '../stores/app-slice';
import { fetcher } from '../utils/hooks';

const useChannels = () => {
  const channels = useSelector((state: { app: AppSliceState }) => state.app.channelList);
  const isCached = channels && (channels as any).channelList;

  const { data, error } = useQuery<{ channelList: Channel[] }>({
    queryKey: ['channels'],
    queryFn: () => fetcher(`${Constants.CONTROL_SERVICE_BASE_URL}/tv/channels`),
    enabled: !isCached,
  });

  return {
    data: isCached ? channels : data,
    isLoading: isCached ? false : !error && !data,
    isError: isCached ? false : error,
  };
};

const useCurrentChannel = () => {
  const currentChannel = useSelector((state: { app: AppSliceState }) => state.app.currentChannel);
  const isCached = currentChannel?.channelId;

  const { data, error } = useQuery<Channel>({
    queryKey: ['currentChannel'],
    queryFn: () => fetcher(`${Constants.CONTROL_SERVICE_BASE_URL}/tv/channels/current`),
    enabled: !isCached,
  });

  return {
    data: isCached ? currentChannel : data,
    isLoading: isCached ? false : !error && !data,
    isError: isCached ? false : error,
  };
};

const useSoftwareInformation = () => {
  const softwareInformation = useSelector(
    (state: { app: AppSliceState }) => state.app.softwareInfo
  );

  const { data, error } = useQuery({
    queryKey: ['softwareInformation'],
    queryFn: () => fetcher(`${Constants.CONTROL_SERVICE_BASE_URL}/system/software`),
    enabled: !softwareInformation,
  });

  return {
    data: softwareInformation || data,
    isLoading: softwareInformation ? false : !error && !data,
    isError: softwareInformation ? false : error,
  };
};

const useSystemPower = () => {
  const powerState = useSelector((state: { app: AppSliceState }) => state.app.powerState);

  const { data, error } = useQuery<PowerStateChange>({
    queryKey: ['systemPower'],
    queryFn: () => fetcher(`${Constants.CONTROL_SERVICE_BASE_URL}/system/power`),
    enabled: !powerState,
  });

  return {
    data: powerState || data,
    isLoading: powerState ? false : !error && !data,
    isError: powerState ? false : error,
  };
};

const useVolume = () => {
  const volume = useSelector((state: { app: AppSliceState }) => state.app.volume);
  const isCached = typeof volume !== 'undefined';

  const { data, error } = useQuery<Volume>({
    queryKey: ['volume'],
    queryFn: () => fetcher(`${Constants.CONTROL_SERVICE_BASE_URL}/media/volume`),
    enabled: !isCached,
  });

  return {
    data: isCached ? volume : data,
    isLoading: isCached ? false : !error && !data,
    isError: isCached ? false : error,
  };
};

const useTvStateToggle = (desiredState: 'on' | 'off') => {
  const { data, error } = useQuery({
    queryKey: ['tvStateToggle', desiredState],
    queryFn: () => fetcher(`${Constants.CONTROL_SERVICE_BASE_URL}/tv/${desiredState}`, { method: 'POST' }),
  });

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

const useUptime = () => {
  const uptime = useSelector((state: { app: AppSliceState }) => state.app.uptime);
  const { data, error } = useQuery({
    queryKey: ['uptime'],
    queryFn: () => fetcher(`${Constants.CONTROL_SERVICE_BASE_URL}/uptime`),
    enabled: !uptime,
  });

  return {
    data: uptime || data,
    isLoading: uptime ? false : !error && !data,
    isError: uptime ? false : error,
  };
};

const useChannelHistory = (start: Date = new Date(), end: Date = new Date()) => {
  const channelHistory = useSelector((state: { app: AppSliceState }) => state.app.channelHistory);
  const isCached = channelHistory && channelHistory.length > 0;

  const { data, error } = useQuery<ChannelHistory[]>({
    queryKey: ['channelHistory', start, end],
    queryFn: () => fetcher(`${Constants.STATISTICS_SERVICE_BASE_URL}/channel-history/search?start=${start}&end=${end}`, {
      body: JSON.stringify({ start, end }),
      method: 'POST',
    }),
    enabled: !isCached,
  });

  return {
    data: isCached ? channelHistory : data,
    isLoading: isCached ? false : !error && !data,
    isError: isCached ? false : error,
  };
};

const useEGP = (countryCode: string) => {
  const egp = useSelector((state: { app: AppSliceState }) => state.app.egpData);
  const isCached = typeof egp !== 'undefined';

  const { data, error } = useQuery({
    queryKey: ['egp', countryCode],
    queryFn: () => fetcher(`${Constants.META_DATA_SERVICE_BASE_URL}/api/v1/channel-metadata?countryCode=${countryCode}`),
    enabled: !isCached,
  });

  return {
    data: isCached ? egp : data,
    isLoading: isCached ? false : !error && !data,
    isError: isCached ? false : error,
  };
};

const useAutomationRules = () => {
  const automationRules = useSelector((state: { app: AppSliceState }) => state.app.automationRules);

  const { data, error } = useQuery({
    queryKey: ['automationRules'],
    queryFn: () => fetcher(`${Constants.AUTOMATION_SERVICE_BASE_URL}/automations`),
    enabled: !automationRules,
  });

  return {
    data: automationRules || data,
    isLoading: automationRules ? false : !error && !data,
    isError: automationRules ? false : error,
  };
};

const useTvIp = () => {
  const { data, error } = useQuery<{ ip: string }>({
    queryKey: ['tvIp'],
    queryFn: () => fetcher(`${Constants.INTERFACE_BASE_URL}/system/info/ip`),
  });

  return {
    data,
    isLoading: data ? false : !error && !data,
    isError: data ? false : error,
  };
};

const useLaunchApp = (launchPointId: string) => {
  const { data } = useQuery({
    queryKey: ['launchApp', launchPointId],
    queryFn: () => fetcher(`${Constants.INTERFACE_BASE_URL}/app/launch`, {
      body: JSON.stringify({ id: launchPointId }),
      method: 'POST',
    }),
  });
  return data;
}

const useForegroundApp = () => {
  const { data, error } = useQuery({
    queryKey: ['foregroundApp'],
    queryFn: () => fetcher(`${Constants.INTERFACE_BASE_URL}/app/foreground`),
  });

  return {
    data,
    isLoading: data ? false : !error && !data,
    isError: data ? false : error,
  };
};

const useLaunchPoints = () => {
  const launchPoints = useSelector((state: { app: AppSliceState }) => state.app.launchPoints);
  const isCached = Array.isArray(launchPoints) && launchPoints?.launchPoints?.length > 0;

  const { data, error } = useQuery<{ launchPoints: LaunchPoint[] }>({
    queryKey: ['launchPoints'],
    queryFn: () => fetcher(`${Constants.INTERFACE_BASE_URL}/app/launch-points`),
    enabled: !isCached,
  });

  return {
    data: isCached ? launchPoints : data,
    isLoading: isCached ? false : !error && !data,
    isError: isCached ? false : error,
  };
};

export {
  useChannels,
  useCurrentChannel,
  useSoftwareInformation,
  useSystemPower,
  useVolume,
  useTvStateToggle,
  useUptime,
  useChannelHistory,
  useEGP,
  useAutomationRules,
  useTvIp,
  useLaunchApp,
  useForegroundApp,
  useLaunchPoints,
};
