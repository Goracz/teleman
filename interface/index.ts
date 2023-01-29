import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Kafka, Producer } from "kafkajs";
import lgtv, { Config } from "lgtv2";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing"

import { logger } from "./utils/logger";

import { TvChannel } from "./models/TvChannel";

import channels from "./routes/tv/channels";
import power from "./routes/system/power";
import screen from "./routes/system/screen";
import info from "./routes/system/info";
import volume from "./routes/media/volume";
import playback from "./routes/media/playback";
import output from "./routes/media/output";

import config from "./environments/environment.local";
import apps from "./routes/app/apps";
import {WebOSStreams} from "./constants/webos-streams";
import {BrokerTopics} from "./constants/broker-topics";
import {Meta} from "./constants/meta";
import EnvironmentLocal from "./environments/environment.local";

// Kafka Stuff
const kafka: Kafka = new Kafka({
  clientId: Meta.serviceId,
  brokers: config.brokers,
});
const producer: Producer = kafka.producer();
producer.connect().then(() => logger.info('Connected to Message Queue.'));

// LG WebOS Stuff
export const ipAddress: string = config.tvIpAddress;
export const connectionUrl: string = `wss://${ipAddress}:3001`;
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
      rejectUnauthorized: false
    }
  }
};

export let connection = lgtv(connectionConfig);

export const reconnect = async () => {
  try {
    let numberOfAttempts = 1;
    const initConnection = setInterval(() => {
      logger.info(`Reconnecting to TV... (${numberOfAttempts}. attempt)`);
      connection = lgtv(connectionConfig);
      numberOfAttempts += 1;
    }, 3000);
    clearInterval(initConnection);
  } catch (err: any) {
    logger.error(`Could not reconnect to TV: ${err.message}.`);
  }
};

const onChannelChange = async (_: any, res: TvChannel) => {
  logger.debug(`Channel changed to: ${res.channelName}.`);
  await producer.send({
    topic: BrokerTopics.CHANNEL_CHANGE,
    messages: [{ value: JSON.stringify(res) }],
  });
};

const onVolumeChange = async (_: any, res: any) => {
  logger.debug(`Volume changed to: ${res.volumeStatus.volume}`);
  await producer.send({
    topic: BrokerTopics.VOLUME_CHANGE,
    messages: [{ value: JSON.stringify(res) }],
  });
};

const onPowerStateChange = async (_: any, res: any) => {
  logger.debug(`Power state changed to: ${JSON.stringify(res)}.`);
  await producer.send({
    topic: BrokerTopics.POWER_STATE_CHANGE,
    messages: [{ value: JSON.stringify(res) }],
  });
};

const onForegroundAppChange = async (_: any, res: any) => {
  logger.debug(`Foreground app changed to: ${JSON.stringify(res)}.`);
  await producer.send({
    topic: BrokerTopics.FOREGROUND_APP_CHANGE,
    messages: [{ value: JSON.stringify(res) }],
  });
};

connection.on("error", (err: any) => {
  logger.error(`Error received from WebOS: ${err}.`);
  reconnect().then(() => logger.info('Re-initiated connection to TV.'));
});

connection.on("connect", () => {
  logger.info('Connected to TV.');

  connection.subscribe(WebOSStreams.CHANNEL_CHANGE_STREAM, onChannelChange);
  logger.debug(`Listening to channel changes...`);

  connection.subscribe(WebOSStreams.VOLUME_CHANGE_STREAM, onVolumeChange);
  logger.debug(`Listening to volume changes...`);

  connection.subscribe(
    WebOSStreams.POWER_STATE_CHANGE_STREAM,
    onPowerStateChange
  );
  logger.debug(`Listening to power state changes...`);

  connection.subscribe(
    WebOSStreams.FOREGROUND_APP_CHANGE_STREAM,
    onForegroundAppChange
  );
  logger.debug(`Listening to foreground application changes...`);
});

// ExpressJS Stuff
dotenv.config();

const app: Express = express();
const port: number = 5000 || process.env.PORT;

// Sentry initialization
if (EnvironmentLocal.sentryDsn) {
  Sentry.init({
    dsn: EnvironmentLocal.sentryDsn,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });
  logger.info("Sentry initialized.");
}

// Middleware
app.use(bodyParser.json());
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// TV Controls
app.use("/api/v1/tv/channels", channels);

// System Controls
app.use("/api/v1/system/power", power);
app.use("/api/v1/system/screen", screen);
app.use("/api/v1/system/info", info);

// Media Controls
app.use("/api/v1/media/volume", volume);
app.use("/api/v1/media/playback", playback);
app.use("/api/v1/media/output", output);

// App Controls
app.use("/api/v1/app", apps);

// Sentry error handler
if (EnvironmentLocal.sentryDsn) {
  app.use(Sentry.Handlers.errorHandler());
  logger.info("Sentry error handler initialized.");
}

app.listen(port, () => {
  logger.info(`Listening on HTTPS at: https://localhost:${port}`);
});
