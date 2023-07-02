import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { Volume } from '../../models/media/Volume';
import { sendRequestToTv } from '../../utils/utils';

const router: Router = Router();

router.get("/", (_: Request, res: Response): Response<Volume> => {
  const volume = sendRequestToTv<Volume>(connection, WebOSEndpoints.GET_VOLUME);
  return res.status(200).json(volume);
});

router.post("/", (req: Request, res: Response): Response<void> => {
  const desiredVolume: number = req.body.volume;
  sendRequestToTv<void>(connection, WebOSEndpoints.SET_VOLUME, {
    volume: desiredVolume,
  });
  return res.status(200).send();
});

router.post("/up", (_: Request, res: Response): Response<void> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.VOLUME_UP);
  return res.status(200).send();
});

router.post("/down", (_: Request, res: Response): Response<void> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.VOLUME_DOWN);
  return res.status(200).send();
});

router.post("/mute", (req: Request, res: Response): Response<void> => {
  const desiredState: boolean = req.body.mute;
  sendRequestToTv<void>(connection, WebOSEndpoints.SET_MUTE, { mute: desiredState });
  return res.status(200).send();
});

export default router;
