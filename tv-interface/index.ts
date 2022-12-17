import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Kafka, Producer } from "kafkajs";
import lgtv, { Config } from "lgtv2";
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

// Kafka Stuff
const kafka: Kafka = new Kafka({
  clientId: "lg-webos-interface",
  brokers: config.brokers,
});
const producer: Producer = kafka.producer();

const initKafka = async () => {
  await producer.connect();
};

// LG WebOS Stuff
export const ipAddress: string = config.tvIpAddress;
export const connectionUrl: string = `ws://${ipAddress}:3000`;
export const connectionConfig: Config = {
  url: connectionUrl,
};

export let connection = lgtv(connectionConfig);

export const reconnect = async () => {
  try {
    const initConnection = setInterval(() => {
      console.log("[DEBUG] Trying to reconnect to TV...");
      connection = lgtv(connectionConfig);
    }, 3000);
    clearInterval(initConnection);
  } catch (err: any) {
    console.error(
      `[ERROR] Error while trying to reconnect to TV: ${err.message}`
    );
  }
};

const onChannelChange = async (_: any, res: TvChannel) => {
  await initKafka();
  console.log(`Channel changed to: ${res.channelName}`);
  await producer.send({
    topic: "channel-change",
    messages: [{ value: JSON.stringify(res) }],
  });
};

const onVolumeChange = async (_: any, res: any) => {
  await initKafka();
  console.log(`Volume changed to: ${res.volumeStatus.volume}`);
  await producer.send({
    topic: "volume-change",
    messages: [{ value: JSON.stringify(res) }],
  });
};

const onPowerStateChange = async (_: any, res: any) => {
  await initKafka();
  console.log(`Power state changed to: ${JSON.stringify(res)}.`);
  await producer.send({
    topic: "power-state-change",
    messages: [{ value: JSON.stringify(res) }],
  });
};

const onForegroundAppChange = async (_: any, res: any) => {
  await initKafka();
  console.log(`Foreground app changed to: ${JSON.stringify(res)}.`);
  await producer.send({
    topic: "foreground-app-change",
    messages: [{ value: JSON.stringify(res) }],
  });
};

connection.on("error", (err: any) => {
  console.log(err);
  reconnect();
});

connection.on("connect", () => {
  console.log("connected");

  connection.subscribe("ssap://tv/getCurrentChannel", onChannelChange);
  connection.subscribe("ssap://audio/getVolume", onVolumeChange);
  connection.subscribe(
    "ssap://com.webos.service.tvpower/power/getPowerState",
    onPowerStateChange
  );
  connection.subscribe(
    "ssap://com.webos.applicationManager/getForegroundAppInfo",
    onForegroundAppChange
  );
});

// ExpressJS Stuff
dotenv.config();

const app: Express = express();
const port: number = 5000 || process.env.PORT;

// Middleware
app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
