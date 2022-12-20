import { Router, Request, Response } from "express";
import { connection } from "../..";

const router: Router = Router();

router.post("/pause", async (_: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe("ssap://media.controls/pause", (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      });
    });

    res.json({
      response,
    });
  } catch (err: any) {
    console.error(`Could not pause playback: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not pause playback.",
      },
    });
  }
});

router.post("/play", async (_: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe("ssap://media.controls/play", (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      });
    });

    res.json({
      response,
    });
  } catch (err: any) {
    console.error(`Could not resume playback: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not resume playback.",
      },
    });
  }
});

router.post("/fast-forward", async (_: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe("ssap://media.controls/fastForward", (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      });
    });

    res.json({
      response,
    });
  } catch (err: any) {
    console.error(`Could not fast forward playback: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not fast forward playback.",
      },
    });
  }
});

router.post("/rewind", async (_: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe("ssap://media.controls/rewind", (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      });
    });

    res.json({
      response,
    });
  } catch (err: any) {
    console.error(`Could not rewind playback: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not rewind playback.",
      },
    });
  }
});

export default router;