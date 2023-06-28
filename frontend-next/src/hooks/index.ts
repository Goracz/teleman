import { useSelector } from 'react-redux';

import { useQuery } from '@tanstack/react-query';

import { LaunchPoint } from '../models/launch-point';
import { AppSliceState } from '../stores/app-slice';
import { fetcher } from '../utils/hooks';

const CONTROL_SERVICE_BASE_URL: string = import.meta.env.VITE_CONTROL_SERVICE_BASE_URL;

const useChannels = () => {
  const channels = useSelector((state: { app: AppSliceState }) => state.app.channelList);
  const isCached = channels && (channels as any).channelList;

  const { data, error } = useQuery({
    queryKey: ['channels'],
    queryFn: () => fetcher(`${CONTROL_SERVICE_BASE_URL}/tv/channels`),
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
  const isCached = Object.prototype.hasOwnProperty.call(currentChannel, 'channelId');

  const { data, error } = useQuery({
    queryKey: ['currentChannel'],
    queryFn: () => fetcher(`${CONTROL_SERVICE_BASE_URL}/tv/channels/current`),
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
    queryFn: () => fetcher(`${CONTROL_SERVICE_BASE_URL}/system/software`),
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

  const { data, error } = useQuery({
    queryKey: ['systemPower'],
    queryFn: () => fetcher(`${CONTROL_SERVICE_BASE_URL}/system/power`),
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
  const isCached = Object.prototype.hasOwnProperty.call(volume, 'volumeStatus');

  const { data, error } = useQuery({
    queryKey: ['volume'],
    queryFn: () => fetcher(`${CONTROL_SERVICE_BASE_URL}/media/volume`),
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
    queryFn: () => fetcher(`${CONTROL_SERVICE_BASE_URL}/tv/${desiredState}`, { method: 'POST' }),
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
    queryFn: () => fetcher('http://localhost:8081/api/v1/uptime'),
    enabled: !uptime,
  });

  return {
    data: uptime || data,
    isLoading: uptime ? false : !error && !data,
    isError: uptime ? false : error,
  };
};

const useChannelHistory = (start: Date, end: Date) => {
  const channelHistory = useSelector((state: { app: AppSliceState }) => state.app.channelHistory);
  const isCached = channelHistory && channelHistory.length > 0;

  const { data, error } = useQuery({
    queryKey: ['channelHistory', start, end],
    queryFn: () => fetcher(`http://localhost:8081/api/v1/channel-history/search?start=${start}&end=${end}`, {
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
  const isCached = egp && egp.length > 0;

  const { data, error } = useQuery({
    queryKey: ['egp', countryCode],
    queryFn: () => fetcher(`http://localhost:8082/api/v1/channel-metadata?countryCode=${countryCode}`),
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
    queryFn: () => fetcher('http://localhost:8083/api/v1/automations'),
    enabled: !automationRules,
  });

  return {
    data: automationRules || data,
    isLoading: automationRules ? false : !error && !data,
    isError: automationRules ? false : error,
  };
};

const useTvIp = () => {
  const { data, error } = useQuery({
    queryKey: ['tvIp'],
    queryFn: () => fetcher('http://localhost:8080/api/v1/system/info/ip'),
  });

  return {
    data,
    isLoading: data ? false : !error && !data,
    isError: data ? false : error,
  };
};

const useLaunchApp = (launchPoint: LaunchPoint) => {
  const { data } = useQuery({
    queryKey: ['launchApp', launchPoint],
    queryFn: () => fetcher('http://localhost:8080/api/v1/app/launch', {
      body: JSON.stringify({ id: launchPoint.id }),
      method: 'POST',
    }),
  });
  return data;
}

const useForegroundApp = () => {
  const { data, error } = useQuery({
    queryKey: ['foregroundApp'],
    queryFn: () => fetcher('http://localhost:8080/api/v1/app/foreground'),
  });

  return {
    data,
    isLoading: data ? false : !error && !data,
    isError: data ? false : error,
  };
};

const useLaunchPoints = () => {
  const launchPoints = useSelector((state: { app: AppSliceState }) => state.app.launchPoints);
  const isCached =
    launchPoints && launchPoints.launchPoints && launchPoints.launchPoints.length > 0;

  const { data, error } = useQuery({
    queryKey: ['launchPoints'],
    queryFn: () => fetcher('http://localhost:8080/api/v1/app/launch-points'),
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
