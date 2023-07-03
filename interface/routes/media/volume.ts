import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { Volume } from '../../models/media/Volume';
import { sendRequestToTv } from '../../utils/utils';

const router: Router = Router();

router.get("/", <T extends Volume>(_: Request, res: Response): Response<T> => {
  const volume = sendRequestToTv<T>(connection, WebOSEndpoints.GET_VOLUME);
  return res.status(200).json(volume);
});

router.post("/", <T = void>(req: Request, res: Response): Response<T> => {
  const desiredVolume: number = req.body.volume;
  sendRequestToTv<T>(connection, WebOSEndpoints.SET_VOLUME, {
    volume: desiredVolume,
  });
  return res.status(200).send();
});

router.post("/up", <T = void>(_: Request, res: Response): Response<T> => {
  sendRequestToTv<T>(connection, WebOSEndpoints.VOLUME_UP);
  return res.status(200).send();
});

router.post("/down", <T = void>(_: Request, res: Response): Response<T> => {
  sendRequestToTv<T>(connection, WebOSEndpoints.VOLUME_DOWN);
  return res.status(200).send();
});

router.post("/mute",<T = void> (req: Request, res: Response): Response<T> => {
  const desiredState: boolean = req.body.mute;
  sendRequestToTv<T>(connection, WebOSEndpoints.SET_MUTE, { mute: desiredState });
  return res.status(200).send();
});

export default router;
