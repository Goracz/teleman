export const PowerStateOption = {
  Active: 'Active',
  ActiveStandby: 'Active Standby',
  Suspend: 'Suspend',
  ScreenSaver: 'Screen Saver',
  Offline: 'Offline',
};

export type PowerStateOption = keyof typeof PowerStateOption;
