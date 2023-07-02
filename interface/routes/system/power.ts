import { Request, Response, Router } from 'express';
import { wake } from 'wol';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { tvIpAddress } from '../../environments/environment.local';
import { getTvMacAddress, sendRequestToTv } from '../../utils/utils';
import { reconnect } from '../../utils/webos-connection';

const router: Router = Router();

router.post("/on", (_: Request, res: Response): Response<{ response: { message: string } }> => {
  getTvMacAddress(tvIpAddress)
    .then((macAddress: string | null) => {
      if (!macAddress) return res.status(500).json({ error: "No MAC address found for TV" });
      wake(macAddress)
        .then(() => reconnect())
        .then(() => {
          return res.status(200).json({
            response: {
              message: "OK",
            },
          });
        })
    });
  return res.status(500).json({ response: { message: "Couldn't turn on TV." } });
});

router.post("/off", (_: Request, res: Response): Response<void> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.TURN_OFF_SYSTEM);
  return res.status(200).send();
});

router.get("/state", (_: Request, res: Response): Response<void> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.POWER_STATE);
  return res.status(200).send();
});

export default router;
