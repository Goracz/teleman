import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import config from '../../environments/environment';
import { SoftwareInformation } from '../../models/system/SoftwareInformation';
import { sendRequestToTv } from '../../utils/utils';

const router: Router = Router();

router.get("/", <T extends SoftwareInformation>(_: Request, res: Response): Response<T> => {
  const currentSoftwareInformation = sendRequestToTv<T>(connection, WebOSEndpoints.CURRENT_SOFTWARE_INFORMATION);
  return res.status(200).json(currentSoftwareInformation);
});

router.get("/ip", (_: Request, res: Response): Response<{ ip: string }> => {
  return res.status(200).json({
    ip: config.tvIpAddress,
  });
});

export default router;
