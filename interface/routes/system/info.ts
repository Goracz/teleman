import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import EnvironmentLocal from '../../environments/environment.local';
import { SoftwareInformation } from '../../models/system/SoftwareInformation';
import { sendRequestToTv } from '../../utils/utils';

const router: Router = Router();

router.get("/", (_: Request, res: Response): Response<SoftwareInformation> => {
  const currentSoftwareInformation = sendRequestToTv<SoftwareInformation>(connection, WebOSEndpoints.CURRENT_SOFTWARE_INFORMATION);
  return res.status(200).json(currentSoftwareInformation);
});

router.get("/ip", (_: Request, res: Response): Response<{ ip: string }> => {
  return res.status(200).json({
    ip: EnvironmentLocal.tvIpAddress,
  });
});

export default router;
