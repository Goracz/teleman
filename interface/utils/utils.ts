import lgtv from 'lgtv2';

import arp from '@network-utils/arp-lookup';

import { WebOSEndpoints } from '../constants/webos-endpoints';
import config from '../environments/environment';

/**
 * Sends a request to the TV over a WebSocket Secure connection
 * @param connection WebSocket Secure connection
 * @param uri URI of the endpoint to send the request to
 * @param payload Payload to send to the endpoint
 */
export const sendRequestToTv = <T>(connection: lgtv, uri: WebOSEndpoints, payload?: unknown): T => {
    connection.request(
        uri,
        payload,
        (err: any, res: T) => {
            if (!err) return res;
            else throw err;
        }
    );
    throw new Error('Invalid state reached in sendRequest().');
};

export const getTvMacAddress = async (ipAddress: string): Promise<string | null> => {
    return config.tvMacAddress || ((await arp.toMAC(ipAddress)) as string);
};

export default {
    sendRequestToTv,
    getTvMacAddress,
};
