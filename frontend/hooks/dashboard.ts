import { useSelector } from 'react-redux';

import { AppSliceState } from '../store/app-slice';

const useConnectionStatus = () => {
  return useSelector((state: { app: AppSliceState }) => state.app.connectionStatus);
};

const useDigitalTvChannelCount = () => {
  return useSelector((state: { app: AppSliceState }) => state.app.digitalTvChannelCount);
};

const useAnalogueTvChannelCount = () => {
  return useSelector((state: { app: AppSliceState }) => state.app.analogueTvChannelCount);
};

const useDigitalRadioChannelCount = () => {
  return useSelector((state: { app: AppSliceState }) => state.app.digitalRadioChannelCount);
};

export {
  useConnectionStatus,
  useDigitalTvChannelCount,
  useAnalogueTvChannelCount,
  useDigitalRadioChannelCount,
};
