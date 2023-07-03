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

router.get("/", <T extends ApplicationList>(_: Request, res: Response): Response<T> => {
  const apps = sendRequestToTv<T>(connection, WebOSEndpoints.LIST_APPS);
  return res.status(200).json(apps);
});

router.get("/foreground", <T extends ForegroundApplication>(_: Request, res: Response): Response<T> => {
  const foregroundApp = sendRequestToTv<T>(connection, WebOSEndpoints.GET_FOREGROUND_APP);
  return res.status(200).json(foregroundApp);
});

router.get("/launch-points",<T extends LaunchPoints> (_: Request, res: Response): Response<T> => {
  const appLaunchPoints = sendRequestToTv<T>(connection, WebOSEndpoints.LIST_APP_LAUNCH_POINTS);
  return res.status(200).json(appLaunchPoints);
});

export default router;
