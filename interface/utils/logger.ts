import ip from 'ip';
// @ts-ignore
import logdnaWinston from 'logdna-winston';
import winston from 'winston';

import { Meta } from '../constants/meta';
import config from '../environments/environment';

const logDNAOptions = {
  key: config.logDnaConfiguration?.ingestionKey,
  hostname: config.logDnaConfiguration?.host,
  ip: ip.address(),
  app: Meta.serviceId,
  env: "Development",
  indexMeta: true,
};

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  defaultMeta: { service: Meta.serviceId },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "rejections.log" }),
  ],
});
if (
  config.logDnaConfiguration?.host &&
  config.logDnaConfiguration?.ingestionKey
) {
  logger.add(new logdnaWinston(logDNAOptions));
}

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
