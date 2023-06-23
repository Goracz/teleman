import { Request, Response, Router } from "express";

import { connection } from "../..";
import { WebOSEndpoints } from "../../constants/webos-endpoints";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const apps = await new Promise((resolve, reject) => {
    connection.request(WebOSEndpoints.LIST_APPS, (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });
  return res.json(apps);
});

router.get("/foreground", async (req: Request, res: Response) => {
  const foregroundApp = await new Promise((resolve, reject) => {
    connection.request(WebOSEndpoints.FOREGROUND_APP_INFO, (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });
  return res.json(foregroundApp);
});

router.get("/launch-points", async (req: Request, res: Response) => {
  const appLaunchPoints = await new Promise((resolve, reject) => {
    connection.request(WebOSEndpoints.LIST_LAUNCH_POINTS, (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });
  return res.json(appLaunchPoints);
});

router.post("/launch", async (req: Request, res: Response) => {
  await new Promise((resolve, reject) => {
    connection.request(
      WebOSEndpoints.LAUNCH_APP,
      { id: req.body.id },
      (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      }
    );
  });
  return res.status(200).json({
    response: {
      message: "OK",
    },
  });
});

export default router;
