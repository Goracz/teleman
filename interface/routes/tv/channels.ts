import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { ChannelList } from '../../models/channels/ChannelList';
import { CurrentChannel } from '../../models/channels/CurrentChannel';
import { Program } from '../../models/channels/Program';
import { sendRequestToTv } from '../../utils/utils';

const router = Router();

router.get("/", <T extends ChannelList>(_: Request, res: Response): Response<T> => {
  const channels = sendRequestToTv<T>(connection, WebOSEndpoints.CHANNEL_LIST);
  return res.status(200).json(channels);
});

router.get("/current", <T extends CurrentChannel>(_: Request, res: Response): Response<T> => {
  const currentChannel = sendRequestToTv<T>(connection, WebOSEndpoints.CURRENT_CHANNEL);
  return res.status(200).json(currentChannel);
});

router.get("/current/program", <T extends Program>(_: Request, res: Response): Response<T> => {
  const currentProgram = sendRequestToTv<T>(connection, WebOSEndpoints.CHANNEL_PROGRAM_INFO);
  return res.status(200).json({
    response: currentProgram,
  });
});

router.post("/next", <T = void>(_: Request, res: Response): Response<T> => {
  sendRequestToTv<T>(connection, WebOSEndpoints.CHANNEL_UP);
  return res.status(200).send();
});

router.post("/previous", <T = void>(_: Request, res: Response): Response<T> => {
  sendRequestToTv<T>(connection, WebOSEndpoints.CHANNEL_DOWN);
  return res.status(200).send();
});

router.post("/", <T = void>(req: Request, res: Response): Response<T> => {
  const targetChannel: string = req.body.channelId;
  sendRequestToTv<T>(connection, WebOSEndpoints.OPEN_CHANNEL, {
    channelId: targetChannel,
  });
  return res.status(200).send();
});

export default router;
