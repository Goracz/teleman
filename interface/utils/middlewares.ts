import bodyParser from 'body-parser';
import cors from 'cors';
import { Express, NextFunction, Request, Response } from 'express';

import * as Sentry from '@sentry/node';

import config from '../environments/environment';

export const registerMiddlewares = (app: Express): void => {
    app.use(bodyParser.json());
    app.use(cors(config.corsOptions));
    if (config.sentryDsn) {
        app.use(Sentry.Handlers.requestHandler());
        app.use(Sentry.Handlers.tracingHandler());
    }
    app.use(errorHandler);
};

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (config.sentryDsn) {
        Sentry.captureException(err);
    }
    return res.status(500).send({ error: err.message });
};

export default {
    registerMiddlewares,
};
