import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { Kafka, Producer } from "kafkajs";
import lgtv, { Config } from "lgtv2";

import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

import { BrokerTopics } from "./constants/broker-topics";
import { Meta } from "./constants/meta";
import { WebOSStreams } from "./constants/webos-streams";
import config from "./environments/environment.local";
import EnvironmentLocal from "./environments/environment.local";
import { TvChannel } from "./models/TvChannel";
import apps from "./routes/app/apps";
import output from "./routes/media/output";
import playback from "./routes/media/playback";
import volume from "./routes/media/volume";
import info from "./routes/system/info";
import power from "./routes/system/power";
import screen from "./routes/system/screen";
import channels from "./routes/tv/channels";
import { logger } from "./utils/logger";
import metrics from "./routes/metrics";
import { kafkajsLogCreator } from "./utils/kafkajs-logger";

require("./tracing");

// Kafka Stuff
const kafka: Kafka = new Kafka({
  clientId: Meta.serviceId,
  brokers:
    process.env.KAFKA_BOOTSTRAP_SERVERS &&
    Array.isArray(process.env.KAFKA_BOOTSTRAP_SERVERS)
      ? process.env.KAFKA_BOOTSTRAP_SERVERS
      : config.brokers,
  logCreator: kafkajsLogCreator,
});
const producer: Producer = kafka.producer();
producer.connect().then(() => logger.info("Connected to Message Queue."));

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
      rejectUnauthorized: false,
    },
  },
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

const onLaunchPointChange = async (_: any, res: any) => {
  logger.debug(`Launch points changed to: ${JSON.stringify(res)}.`);
  await producer.send({
    topic: BrokerTopics.LAUNCH_POINT_CHANGE,
    messages: [{ value: JSON.stringify(res) }],
  });
};

connection.on("prompt", () => {
  console.log("prompt requested...");
});

connection.on("error", (err: any) => {
  logger.error(`Error received from WebOS: ${err}.`);
  reconnect().then(() => logger.info("Re-initiated connection to TV."));
});

connection.on("connect", () => {
  logger.info("Connected to TV.");

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

  // For testing purposes
  connection.subscribe(
    WebOSStreams.LAUNCH_POINT_CHANGE_STREAM,
    onLaunchPointChange
  );
  logger.debug("Listening to ...");
});

// ExpressJS Stuff
dotenv.config();

const app: Express = express();
const port: string = process.env.PORT || "5000";

// Sentry initialization
if (EnvironmentLocal.sentryDsn) {
  Sentry.init({
    dsn: EnvironmentLocal.sentryDsn,
    integrations: [
      new Sentry.Integrations.Http({ tracing: false }),
      new ProfilingIntegration(),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({
        // to trace all requests to the default router
        app,
        // alternatively, you can specify the routes you want to trace:
        // router: someRouter,
      }),
    ],
    profilesSampleRate: 1.0,
    tracesSampleRate: 1.0,
  });
  logger.info("Sentry initialized.");
}

const corsOptions = {
  origin: "*",
};

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));

if (EnvironmentLocal.sentryDsn) {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Metrics
app.use("/metrics", metrics);

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
  logger.info(`Listening on HTTP at: http://localhost:${port}`);
});
