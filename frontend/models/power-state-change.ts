export type PowerStateChange = {
    returnValue: boolean;
    state: keyof typeof PowerState;
    subscribed?: boolean;
    processing?: keyof typeof PowerStateProcessing;
};

export const PowerState = {
    Active: 'Active',
    'Active Standby': 'Active Standby',
    Suspend: 'Suspend',
    ScreenSaver: 'Screen Saver',
    Offline: 'Offline',
};

export const PowerStateProcessing = {
    'Prepare Suspend': 'Prepare Suspend',
    'Screen On': 'Screen On',
    'Request Screen Saver': 'Request Screen Saver',
};
