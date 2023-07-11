import { useMemo } from 'react';

import { PowerStateChange } from '../models/tv/power-state/power-state-change';
import { PowerStateOption } from '../models/tv/power-state/power-state-option';
import { TvStates } from '../models/tv/system/tv-states';

const useConnectionStateText = (powerState?: PowerStateOption | PowerStateChange) => {
    return useMemo(() => {
        if (isPowerStateChange(powerState) || !powerState) return;

        if (TvStates.ONLINE.includes(powerState)) return 'Connected';
        if (TvStates.OFFLINE.includes(powerState)) return 'Paired';
        return 'Disconnected';
    }, [powerState]);
};

const isPowerStateChange = (powerState?: PowerStateOption | PowerStateChange): powerState is PowerStateChange => {
    return useMemo(() => {
        if (!powerState) return false;
        return Object.prototype.hasOwnProperty.call(powerState, 'state');
    }, [powerState]);
};

export {
    useConnectionStateText,
};
