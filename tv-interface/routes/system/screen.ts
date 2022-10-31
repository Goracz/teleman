import { Router, Request, Response } from "express";
import { connection } from "../..";

const router: Router = Router();

router.post("/on", async (_: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe(
        "ssap://com.webos.service.tvpower/power/turnOnScreen",
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
    console.error(`Could not turn on TV: ${err.message}`);

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
        "ssap://com.webos.service.tvpower/power/turnOffScreen",
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
    console.error(`Could not turn on TV: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not turn on TV.",
      },
    });
  }
});

export default router;
