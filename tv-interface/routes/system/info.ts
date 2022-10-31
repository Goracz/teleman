import { Router, Request, Response } from "express";
import { connection } from "../..";

const router: Router = Router();

router.get("/", async (_: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe(
        "ssap://com.webos.service.update/getCurrentSWInformation",
        (err, res) => {
          if (!err) resolve(res);
          else reject(err);
        }
      );
    });

    res.json(response);
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
