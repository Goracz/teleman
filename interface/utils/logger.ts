import winston from 'winston';
// @ts-ignore
import logdnaWinston from 'logdna-winston';
import ip from 'ip';
import {Meta} from "../constants/meta";
import EnvironmentLocal from "../environments/environment.local";

const logDNAOptions = {
    key: EnvironmentLocal.logDnaConfiguration.ingestionKey,
    hostname: EnvironmentLocal.logDnaConfiguration.host,
    ip: ip.address(),
    app: Meta.serviceId,
    env: "Development",
    indexMeta: true
};

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: Meta.serviceId },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
    exceptionHandlers: [new winston.transports.File({ filename: "exceptions.log" })],
    rejectionHandlers: [new winston.transports.File({ filename: "rejections.log" })],
});
if (
    EnvironmentLocal.logDnaConfiguration.host &&
    EnvironmentLocal.logDnaConfiguration.ingestionKey
) {
    logger.add(new logdnaWinston(logDNAOptions));
}

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
