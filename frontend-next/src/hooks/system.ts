import { PowerState } from '../models/tv/power-state/power-state-change';
import { PowerStateOption } from '../models/tv/power-state/power-state-option';
import { TvStatus } from '../models/tv/system/tv-status';
import { useChannelHistory, useSystemPower } from './';

/**
 * Returns the status of the TV.
 * @returns {TvStatus} The status of the TV.
 */
const useStatus = (): TvStatus => {
    const powerState = useSystemPower();

    if (!powerState.data) return TvStatus.Unknown;
    return [PowerState.Active, PowerState['Active Standby']].includes(powerState.data as PowerStateOption)
        ? TvStatus.Up
        : TvStatus.Down;
};

/**
 * Returns the LAN IP address of the TV.
 * @returns {string} The LAN IP address of the TV.
 */
const useLanIp = (): string | null => {
    return '192.168.1.246'; // TODO
};

/**
 * Returns the number of seconds the TV has been up.
 * @returns {number} The number of seconds the TV has been up.
 */
const useUptimeSeconds = (): number | undefined => {
    const channelHistories = useChannelHistory();
    if (!channelHistories.data) return undefined;

    const lastEntry = channelHistories.data[channelHistories.data.length - 1];
    if (lastEntry.end) {
        return (new Date(lastEntry.end).getTime() - new Date(lastEntry.start).getTime()) / 1000;
    }

    return new Date(lastEntry.start).getTime() / 1000;
};

export {
    useStatus,
    useLanIp,
    useUptimeSeconds,
};
