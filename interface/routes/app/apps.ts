import { Router, Request, Response } from "express";

import { connection } from "../..";
import { sendRequestToTv } from "../../utils/utils";
import { WebOSEndpoints } from "../../constants/webos-endpoints";

const router: Router = Router();

router.post("/launch", (req: Request, res: Response) => {
  sendRequestToTv(connection, WebOSEndpoints.LAUNCH_APPLICATION, { id: req.body.id });
  return res.status(200).json({
    response: {
      message: "OK",
    },
  });
});

router.get("/", (_: Request, res: Response) => {
  const apps = sendRequestToTv(connection, WebOSEndpoints.LIST_APPS);
  return res.status(200).json(apps);
});

router.get("/foreground", (_: Request, res: Response) => {
  const foregroundApp = sendRequestToTv(connection, WebOSEndpoints.GET_FOREGROUND_APP);
  return res.status(200).json(foregroundApp);
});

router.get("/launch-points", (_: Request, res: Response) => {
  const appLaunchPoints = sendRequestToTv(connection, WebOSEndpoints.LIST_APP_LAUNCH_POINTS);
  return res.status(200).json(appLaunchPoints);
});

export default router;
