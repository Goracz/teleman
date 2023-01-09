import { Router, Request, Response } from "express";
import { connection } from "../..";
import {WebOSEndpoints} from "../../constants/webos-endpoints";
import {logger} from "../../utils/logger";

const router: Router = Router();

router.post("/on", async (_: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe(
        WebOSEndpoints.TURN_ON_SCREEN,
        { standByMode: "active" },
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
    logger.error(`Could not turn on TV: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not turn on TV.",
      },
    });
  }
});

router.post("/off", async (_: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe(
        WebOSEndpoints.TURN_OFF_SCREEN,
        { standByMode: "active" },
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
    logger.error(`Could not turn on TV: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not turn on TV.",
      },
    });
  }
});

export default router;
