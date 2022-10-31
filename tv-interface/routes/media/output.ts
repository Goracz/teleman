import { Router, Request, Response } from "express";
import { connection } from "../..";

const router: Router = Router();

router.get("/", async (_: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe("ssap://audio/getSoundOutput", (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      });
    });

    res.json({
      response,
    });
  } catch (err: any) {
    console.error(`Could not get current sound output: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not get current sound output.",
      },
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe(
        "ssap://audio/setSoundOutput",
        { output: req.body.output },
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
    console.error(`Could not set sound output: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not set sound output.",
      },
    });
  }
});

export default router;
