import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { sendRequestToTv } from '../../utils/utils';

const router: Router = Router();

router.get("/", <T = unknown>(_: Request, res: Response): Response<T> => {
  const soundOutput = sendRequestToTv<T>(connection, WebOSEndpoints.GET_SOUND_OUTPUT);
  return res.status(200).json(soundOutput);
});

router.post("/", <T = void>(req: Request, res: Response): Response<T> => {
  sendRequestToTv<T>(connection, WebOSEndpoints.SET_SOUND_OUTPUT, { output: req.body.output });
  return res.status(200).send();
});

export default router;
