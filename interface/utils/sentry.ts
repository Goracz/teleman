import { Express } from 'express';

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import * as Tracing from '@sentry/tracing';

import config from '../environments/environment';
import { logger } from './logger';

export const initializeSentry = (app: Express): void => {
    if (config.sentryDsn) {
        Sentry.init({
            dsn: config.sentryDsn,
            integrations: [
                new Sentry.Integrations.Http({ tracing: true }),
                new Tracing.Integrations.Express({ app }),
                new ProfilingIntegration(),
            ],
            tracesSampleRate: 1.0,
            profilesSampleRate: 1.0,
        });
        logger.info("Sentry initialized.");
    }
};

export const registerSentryErrorHandler = (app: Express): void => {
    if (config.sentryDsn) {
        app.use(Sentry.Handlers.errorHandler());
        logger.info("Sentry error handler initialized.");
    }
};

export default {
    initializeSentry,
    registerSentryErrorHandler,
};
