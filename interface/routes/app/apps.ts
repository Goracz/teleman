import { Request, Response, Router } from 'express';

import { connection } from '../..';
import { WebOSEndpoints } from '../../constants/webos-endpoints';
import { ApplicationList } from '../../models/applications/ApplicationList';
import { ForegroundApplication } from '../../models/applications/ForegroundApplication';
import { LaunchPoints } from '../../models/applications/LaunchPoints';
import { sendRequestToTv } from '../../utils/utils';

const router: Router = Router();

router.post("/launch", (req: Request, res: Response): Response<{ response: { message: string } }> => {
  sendRequestToTv<void>(connection, WebOSEndpoints.LAUNCH_APPLICATION, { id: req.body.id });
  return res.status(200).json({
    response: {
      message: "OK",
    },
  });
});

router.get("/", (_: Request, res: Response): Response<ApplicationList> => {
  const apps = sendRequestToTv<ApplicationList>(connection, WebOSEndpoints.LIST_APPS);
  return res.status(200).json(apps);
});

router.get("/foreground", (_: Request, res: Response): Response<ForegroundApplication> => {
  const foregroundApp = sendRequestToTv<ForegroundApplication>(connection, WebOSEndpoints.GET_FOREGROUND_APP);
  return res.status(200).json(foregroundApp);
});

router.get("/launch-points", (_: Request, res: Response): Response<LaunchPoints> => {
  const appLaunchPoints = sendRequestToTv<LaunchPoints>(connection, WebOSEndpoints.LIST_APP_LAUNCH_POINTS);
  return res.status(200).json(appLaunchPoints);
});

export default router;
