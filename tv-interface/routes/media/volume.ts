import { Router, Request, Response } from "express";
import { connection } from "../..";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  let response;

  response = await new Promise((resolve, reject) => {
    connection.subscribe("ssap://audio/getVolume", (err, res) => {
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
      "ssap://audio/setVolume",
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
      connection.subscribe("ssap://audio/volumeUp", (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      });
    });

    res.json({
      response,
    });
  } catch (err: any) {
    console.error(`Could not turn up volume: ${err.message}`);

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
      connection.subscribe("ssap://audio/volumeDown", (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      });
    });

    res.json({
      response,
    });
  } catch (err: any) {
    console.error(`Could not turn down volume: ${err.message}`);

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
        "ssap://audio/setMute",
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
    console.error(`Could not (un)mute volume: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not (un)mute volume.",
      },
    });
  }
});

export default router;
