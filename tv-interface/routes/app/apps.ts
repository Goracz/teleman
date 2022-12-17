import { Router, Request, Response } from "express";

import { connection } from "../..";

const router: Router = Router();

router.post("/launch", async (req: Request, res: Response) => {
  await new Promise((resolve, reject) => {
    connection.request(
      "ssap://com.webos.applicationManager/launch",
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

router.get("/", async (req: Request, res: Response) => {
  const apps = await new Promise((resolve, reject) => {
    connection.request(
      "ssap://com.webos.applicationManager/listApps",
      (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      }
    );
  });
  return res.json(apps);
});

router.get("/foreground", async (req: Request, res: Response) => {
  const foregroundApp = await new Promise((resolve, reject) => {
    connection.request(
      "ssap://com.webos.applicationManager/getForegroundAppInfo",
      (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      }
    );
  });
  return res.json(foregroundApp);
});

router.get("/launch-points", async (req: Request, res: Response) => {
  const appLaunchPoints = await new Promise((resolve, reject) => {
    connection.request(
      "ssap://com.webos.applicationManager/listLaunchPoints",
      (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      }
    );
  });
  return res.json(appLaunchPoints);
});

export default router;
