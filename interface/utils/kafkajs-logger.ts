import { logger } from "./logger";
import { LogEntry, logLevel } from "kafkajs";

export function kafkajsLogCreator() {
  return ({ namespace, level, label, log }: LogEntry) => {
    const message = `${namespace} - ${label}: ${log.message}`;
    switch (level) {
      case logLevel.DEBUG:
        logger.debug(message);
        break;
      case logLevel.INFO:
        logger.info(message);
        break;
      case logLevel.WARN:
        logger.warn(message);
        break;
      case logLevel.ERROR:
      case logLevel.NOTHING:
        logger.error(message);
        break;
      default:
        logger.info(message);
    }
  };
}
