import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { sendRequestToTv } from '../../utils/utils';

const router: Router = Router();

router.post("/on", <T = void>(_: Request, res: Response): Response<T> => {
  sendRequestToTv<T>(connection, WebOSEndpoints.TURN_ON_SCREEN, {
    standByMode: "active",
  });
  return res.status(200).send();
});

router.post("/off", <T = void>(_: Request, res: Response): Response<T> => {
  sendRequestToTv<T>(connection, WebOSEndpoints.TURN_OFF_SCREEN, {
    standByMode: "active",
  });
  return res.status(200).send();
});

export default router;
