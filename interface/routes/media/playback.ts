import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { sendRequestToTv } from '../../utils/utils';

const router: Router = Router();

router.post("/pause", <T = void>(_: Request, res: Response): Response<T> => {
  sendRequestToTv<T>(connection, WebOSEndpoints.PAUSE_PLAYBACK);
  return res.status(200).send();
});

router.post("/play", <T = void>(_: Request, res: Response): Response<T> => {
  sendRequestToTv<T>(connection, WebOSEndpoints.START_PLAYBACK);
  return res.status(200).send();
});

router.post("/fast-forward", <T = void>(_: Request, res: Response): Response<T> => {
  sendRequestToTv<T>(connection, WebOSEndpoints.FAST_FORWARD_PLAYBACK);
  return res.status(200).send();
});

router.post("/rewind", <T = void>(_: Request, res: Response): Response<T> => {
  sendRequestToTv<T>(connection, WebOSEndpoints.REWIND_PLAYBACK);
  return res.status(200).send();
});

export default router;
