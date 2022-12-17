import { Request, Response, Router } from "express";
import { connection } from "../..";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  let channels;

  channels = await new Promise((resolve, reject) => {
    connection.subscribe("ssap://tv/getChannelList", (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });

  res.json(channels);
});

router.get("/current", async (req: Request, res: Response) => {
  let currentChannel;

  currentChannel = await new Promise((resolve, reject) => {
    connection.subscribe("ssap://tv/getCurrentChannel", (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });

  res.json(currentChannel);
});

router.get("/current/program", async (req: Request, res: Response) => {
  let currentProgram;

  currentProgram = await new Promise((resolve, reject) => {
    connection.subscribe("ssap://tv/getChannelProgramInfo", (err, res) => {
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
    connection.subscribe("ssap://tv/channelUp", (err, res) => {
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
    connection.subscribe("ssap://tv/channelDown", (err, res) => {
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
      "ssap://tv/openChannel",
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
