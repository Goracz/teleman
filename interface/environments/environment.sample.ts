/**
 * Create an environment.local.ts file in the same directory as this file is in,
 * with the respective data.
 */

import { Config } from 'lgtv2';

/**
 * Required - Your TV's IP address
 */
export const tvIpAddress: string = "";
/**
 * Optional - Your TV's MAC address
 */
export const tvMacAddress: string = "";
/**
 * Required - Apache Kafka broker's address (IP:PORT)
 */
export const brokers: string[] = [];
/**
 * Required - Your CORS configuration
 */
export const corsOptions = {
  origin: "*",
};
/**
 * Required - A constant connection URL to your TV's WebSocket Secure socket
 */
export const connectionUrl: string = `wss://${tvIpAddress}:3001`;
/**
 * Required - WebSocket Secure connection configuration
 */
export const connectionConfig: Config = {
  url: connectionUrl,
  timeout: 30_000,
  // @ts-ignore
  wsconfig: {
    keepalive: true,
    keepaliveInterval: 10000,
    dropConnectionOnKeepaliveTimeout: true,
    keepaliveGracePeriod: 5000,
    tlsOptions: {
      rejectUnauthorized: false,
    },
  },
};
/**
 * Optional - Your LogDNA configuration
 */
export const logDnaConfiguration = {
  ingestionKey: "",
  host: "",
};
/**
 * Optional - Your Sentry project's DSN
 */
export const sentryDsn = "";

export default {
  tvIpAddress,
  tvMacAddress,
  brokers,
  corsOptions,
  connectionUrl,
  connectionConfig,
  logDnaConfiguration,
  sentryDsn,
};
