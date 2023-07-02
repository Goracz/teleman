import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { sendRequestToTv } from '../../utils/utils';

const router: Router = Router();

router.get("/", (_: Request, res: Response): Response<unknown> => {
  const soundOutput = sendRequestToTv<unknown>(connection, WebOSEndpoints.GET_SOUND_OUTPUT);
  return res.status(200).json(soundOutput);
});

router.post("/", (req: Request, res: Response): Response<void> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.SET_SOUND_OUTPUT, { output: req.body.output });
  return res.status(200).send();
});

export default router;
