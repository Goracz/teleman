import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { sendRequestToTv } from '../../utils/utils';

const router: Router = Router();

router.post("/pause", (_: Request, res: Response): Response<void> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.PAUSE_PLAYBACK);
  return res.status(200).send();
});

router.post("/play", (_: Request, res: Response): Response<void> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.START_PLAYBACK);
  return res.status(200).send();
});

router.post("/fast-forward", (_: Request, res: Response): Response<void> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.FAST_FORWARD_PLAYBACK);
  return res.status(200).send();
});

router.post("/rewind", (_: Request, res: Response): Response<void> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.REWIND_PLAYBACK);
  return res.status(200).send();
});

export default router;
