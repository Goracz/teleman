import { Request, Response, Router } from "express";
import { connection } from "../..";
import { WebOSEndpoints } from "../../constants/webos-endpoints";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  let channels;

  channels = await new Promise((resolve, reject) => {
    connection.subscribe(WebOSEndpoints.CHANNEL_LIST, (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });

  res.json(channels);
});

router.get("/current", async (req: Request, res: Response) => {
  let currentChannel;

  currentChannel = await new Promise((resolve, reject) => {
    connection.subscribe(WebOSEndpoints.CURRENT_CHANNEL, (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });

  res.json(currentChannel);
});

router.get("/current/program", async (req: Request, res: Response) => {
  let currentProgram;

  currentProgram = await new Promise((resolve, reject) => {
    connection.subscribe(WebOSEndpoints.CHANNEL_PROGRAM_INFO, (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });

  res.json({
    response: currentProgram,
  });
});

router.post("/next", async (req: Request, res: Response) => {
  let nextChannel;

  nextChannel = await new Promise((resolve, reject) => {
    connection.subscribe(WebOSEndpoints.CHANNEL_UP, (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });

  res.json({
    response: nextChannel,
  });
});

router.post("/previous", async (req: Request, res: Response) => {
  let previousChannel;

  previousChannel = await new Promise((resolve, reject) => {
    connection.subscribe(WebOSEndpoints.CHANNEL_DOWN, (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });

  res.json({
    response: previousChannel,
  });
});

router.post("/", async (req: Request, res: Response) => {
  const targetChannel: string = req.body.channelId;
  let channel;

  channel = await new Promise((resolve, reject) => {
    connection.request(
      WebOSEndpoints.OPEN_CHANNEL,
      { channelId: targetChannel },
      (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      }
    );
  });

  res.json({
    response: channel,
  });
});

export default router;
