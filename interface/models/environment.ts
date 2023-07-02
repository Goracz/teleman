import { CorsOptions } from 'cors';
import { Config } from 'lgtv2';

export interface Environment {
    tvIpAddress: string;
    tvMacAddress: string;
    brokers: string[];
    corsOptions: CorsOptions;
    connectionUrl: string;
    connectionConfig: Config;
    logDnaConfiguration?: { ingestionKey: string, host: string };
    sentryDsn?: string;
};
