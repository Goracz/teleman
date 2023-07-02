import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { ChannelList } from '../../models/channels/ChannelList';
import { CurrentChannel } from '../../models/channels/CurrentChannel';
import { Program } from '../../models/channels/Program';
import { sendRequestToTv } from '../../utils/utils';

const router = Router();

router.get("/", (_: Request, res: Response): Response<ChannelList> => {
  const channels = sendRequestToTv<ChannelList>(connection, WebOSEndpoints.CHANNEL_LIST);
  return res.status(200).json(channels);
});

router.get("/current", (_: Request, res: Response): Response<CurrentChannel> => {
  const currentChannel = sendRequestToTv<CurrentChannel>(connection, WebOSEndpoints.CURRENT_CHANNEL);
  return res.status(200).json(currentChannel);
});

router.get("/current/program", (_: Request, res: Response): Response<Program> => {
  const currentProgram = sendRequestToTv<Program>(connection, WebOSEndpoints.CHANNEL_PROGRAM_INFO);
  return res.status(200).json({
    response: currentProgram,
  });
});

router.post("/next", (_: Request, res: Response): Response<void> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.CHANNEL_UP);
  return res.status(200).send();
});

router.post("/previous", (_: Request, res: Response): Response<void> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.CHANNEL_DOWN);
  return res.status(200).send();
});

router.post("/", (req: Request, res: Response): Response<void> => {
  const targetChannel: string = req.body.channelId;
  sendRequestToTv<void>(connection, WebOSEndpoints.OPEN_CHANNEL, {
    channelId: targetChannel,
  });
  return res.status(200).send();
});

export default router;
