import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { sendRequestToTv } from '../../utils/utils';

const router = Router();

router.get("/", (_: Request, res: Response) => {
  const channels = sendRequestToTv(connection, WebOSEndpoints.CHANNEL_LIST);
  return res.status(200).json(channels);
});

router.get("/current", (_: Request, res: Response) => {
  const currentChannel = sendRequestToTv(connection, WebOSEndpoints.CURRENT_CHANNEL);
  return res.status(200).json(currentChannel);
});

router.get("/current/program", (_: Request, res: Response) => {
  const currentProgram = sendRequestToTv(connection, WebOSEndpoints.CHANNEL_PROGRAM_INFO);
  return res.status(200).json({
    response: currentProgram,
  });
});

router.post("/next", (_: Request, res: Response) => {
  const nextChannel = sendRequestToTv(connection, WebOSEndpoints.CHANNEL_UP);
  return res.status(200).json({
    response: nextChannel,
  });
});

router.post("/previous", (_: Request, res: Response) => {
  const previousChannel = sendRequestToTv(connection, WebOSEndpoints.CHANNEL_DOWN);
  return res.status(200).json({
    response: previousChannel,
  });
});

router.post("/", (req: Request, res: Response) => {
  const targetChannel: string = req.body.channelId;
  const channel = sendRequestToTv(connection, WebOSEndpoints.OPEN_CHANNEL, {
    channelId: targetChannel,
  });
  res.status(200).json({
    response: channel,
  });
});

export default router;
