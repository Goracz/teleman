import { PowerStateOption } from '../power-state/power-state-option';

export const TvStates: { ONLINE: PowerStateOption[], OFFLINE: PowerStateOption[] } = {
    ONLINE: [
        PowerStateOption.Active as keyof typeof PowerStateOption,
        PowerStateOption.ActiveStandby as keyof typeof PowerStateOption,
    ],
    OFFLINE: [
        PowerStateOption.Offline as keyof typeof PowerStateOption,
        PowerStateOption.ScreenSaver as keyof typeof PowerStateOption,
        PowerStateOption.Suspend as keyof typeof PowerStateOption,
    ],
};

export type TvStates = keyof typeof TvStates;
