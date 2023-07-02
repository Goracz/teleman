import express, { Express } from 'express';
import lgtv from 'lgtv2';

import config from './environments/environment';
import { initializeKafka } from './utils/kafka';
import { logger } from './utils/logger';
import { registerMiddlewares } from './utils/middlewares';
import { registerRouterHandlers } from './utils/routes';
import { registerEventListeners } from './utils/webos-connection';

const producer = initializeKafka();
export let connection = lgtv(config.connectionConfig);
registerEventListeners(connection, producer);

const app: Express = express();
const port: number | string = process.env.PORT ?? 5000;
// initializeSentry(app);
registerMiddlewares(app);
registerRouterHandlers(app);
// registerSentryErrorHandler(app);

app.listen(() => {
  logger.info(`Listening on :${port}`);
});

export const resetConnection = (newConnection: lgtv) => {
  connection = newConnection;
  registerEventListeners(connection, producer);
};
