import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { sendRequestToTv } from '../../utils/utils';

const router: Router = Router();

router.post("/on", (_: Request, res: Response) => {
  const response = sendRequestToTv(connection, WebOSEndpoints.TURN_ON_SCREEN, {
    standByMode: "active",
  });
  return res.status(200).json(response);
});

router.post("/off", (_: Request, res: Response) => {
  const response = sendRequestToTv(connection, WebOSEndpoints.TURN_OFF_SCREEN, {
    standByMode: "active",
  });
  return res.status(200).json(response);
});

export default router;
