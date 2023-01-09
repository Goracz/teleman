import { useSelector } from 'react-redux';
import useSWR from 'swr';
import { AppSliceState } from '../store/app-slice';

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const channelHistoryFetcher = (url: string, start: Date, end: Date) =>
  fetch(url, {
    body: JSON.stringify({ start, end }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  } as any)
    .then((r) => r.json())
    .catch(() => {
      throw new Error('Error fetching channel history');
    });

const useChannels = () => {
  const channels = useSelector((state: { app: AppSliceState }) => state.app.channelList);
  const isCached = channels && (channels as any).channelList;

  const { data, error } = useSWR(
    isCached ? null : 'http://localhost:8080/api/v1/tv/channels',
    fetcher
  );

  return {
    data: isCached ? channels : data,
    isLoading: isCached ? false : !error && !data,
    isError: isCached ? false : error,
  };
};

const useCurrentChannel = () => {
  const currentChannel = useSelector((state: { app: AppSliceState }) => state.app.currentChannel);
  const isCached = Object.prototype.hasOwnProperty.call(currentChannel, 'channelId');

  const { data, error } = useSWR(
    isCached ? null : 'http://localhost:8080/api/v1/tv/channels/current',
    fetcher
  );

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

  const { data, error } = useSWR(
    softwareInformation ? null : 'http://localhost:8080/api/v1/system/software',
    fetcher
  );

  return {
    data: softwareInformation || data,
    isLoading: softwareInformation ? false : !error && !data,
    isError: softwareInformation ? false : error,
  };
};

const useSystemPower = () => {
  const powerState = useSelector((state: { app: AppSliceState }) => state.app.powerState);

  const { data, error } = useSWR(
    powerState ? null : 'http://localhost:8080/api/v1/system/power',
    fetcher
  );

  return {
    data: powerState || data,
    isLoading: powerState ? false : !error && !data,
    isError: powerState ? false : error,
  };
};

const useVolume = () => {
  const volume = useSelector((state: { app: AppSliceState }) => state.app.volume);
  const isCached = Object.prototype.hasOwnProperty.call(volume, 'volumeStatus');

  const { data, error } = useSWR(
    isCached ? null : 'http://localhost:8080/api/v1/media/volume',
    fetcher
  );

  return {
    data: isCached ? volume : data,
    isLoading: isCached ? false : !error && !data,
    isError: isCached ? false : error,
  };
};

const useTvStateToggle = (desiredState: 'on' | 'off') => {
  const { data, error } = useSWR(
    `http://localhost:8080/api/v1/system/power/${desiredState}`,
    fetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

const useUptime = () => {
  const uptime = useSelector((state: { app: AppSliceState }) => state.app.uptime);
  const { data, error } = useSWR(uptime ? null : 'http://localhost:8081/api/v1/uptime', fetcher);

  return {
    data: uptime || data,
    isLoading: uptime ? false : !error && !data,
    isError: uptime ? false : error,
  };
};

const useChannelHistory = (start: Date, end: Date) => {
  const channelHistory = useSelector((state: { app: AppSliceState }) => state.app.channelHistory);
  const isCached = channelHistory && channelHistory.length > 0;

  const { data, error } = useSWR(
    isCached ? null : ['http://localhost:8081/api/v1/channel-history/search', start, end],
    channelHistoryFetcher
  );

  return {
    data: isCached ? channelHistory : data,
    isLoading: isCached ? false : !error && !data,
    isError: isCached ? false : error,
  };
};

const useEGP = (countryCode: string) => {
  const egp = useSelector((state: { app: AppSliceState }) => state.app.egpData);
  const isCached = egp && egp.length > 0;

  const { data, error } = useSWR(
    isCached ? null : `http://localhost:8082/api/v1/channel-metadata?countryCode=${countryCode}`,
    fetcher
  );

  return {
    data: isCached ? egp : data,
    isLoading: isCached ? false : !error && !data,
    isError: isCached ? false : error,
  };
};

const useAutomationRules = () => {
  const automationRules = useSelector((state: { app: AppSliceState }) => state.app.automationRules);

  const { data, error } = useSWR(
    automationRules ? null : 'http://localhost:8083/api/v1/automations',
    fetcher
  );

  return {
    data: automationRules || data,
    isLoading: automationRules ? false : !error && !data,
    isError: automationRules ? false : error,
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
};
