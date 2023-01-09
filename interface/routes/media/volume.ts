import { Router, Request, Response } from "express";
import { connection } from "../..";
import {WebOSEndpoints} from "../../constants/webos-endpoints";
import {logger} from "../../utils/logger";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  let response;

  response = await new Promise((resolve, reject) => {
    connection.subscribe(WebOSEndpoints.GET_VOLUME, (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });

  res.json(response);
});

router.post("/", async (req: Request, res: Response) => {
  const desiredVolume: number = req.body.volume;
  let response;

  response = await new Promise((resolve, reject) => {
    connection.request(
      WebOSEndpoints.SET_VOLUME,
      { volume: desiredVolume },
      (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      }
    );
  });

  res.json(response);
});

router.post("/up", async (req: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe(WebOSEndpoints.VOLUME_UP, (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      });
    });

    res.json({
      response,
    });
  } catch (err: any) {
    logger.error(`Could not turn up volume: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not turn up volume.",
      },
    });
  }
});

router.post("/down", async (req: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe(WebOSEndpoints.VOLUME_DOWN, (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      });
    });

    res.json({
      response,
    });
  } catch (err: any) {
    logger.error(`Could not turn down volume: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not turn down volume.",
      },
    });
  }
});

router.post("/mute", async (req: Request, res: Response) => {
  try {
    const desiredState: boolean = req.body.mute;
    let response;

    response = await new Promise((resolve, reject) => {
      connection.request(
        WebOSEndpoints.SET_MUTE,
        { mute: desiredState },
        (err, res) => {
          if (!err) resolve(res);
          else reject(err);
        }
      );
    });

    res.json({
      response,
    });
  } catch (err: any) {
    logger.error(`Could not (un)mute volume: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not (un)mute volume.",
      },
    });
  }
});

export default router;
