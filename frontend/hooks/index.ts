import { useSelector } from 'react-redux';
import useSWR from 'swr';
import { ChannelHistory } from '../models/channel-history';
import { AppSliceState } from '../store/app-slice';

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const postFetcher = (url: string, body: any) =>
  fetch(url, { body, method: 'POST' }).then((r) => r.json());

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
  const { data, error } = useSWR('http://localhost:8081/api/v1/uptime', fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

const useChannelHistory = async (start: Date, end: Date): Promise<ChannelHistory[]> =>
  fetch('http://localhost:8081/api/v1/channel-history/search', {
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

export {
  useChannels,
  useCurrentChannel,
  useSoftwareInformation,
  useSystemPower,
  useVolume,
  useTvStateToggle,
  useUptime,
  useChannelHistory,
};
