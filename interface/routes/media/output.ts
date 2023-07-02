import { Router, Request, Response } from "express";
import { connection } from "../..";
import {WebOSEndpoints} from "../../constants/webos-endpoints";
import { sendRequestToTv } from "../../utils/utils";

const router: Router = Router();

router.get("/", (_: Request, res: Response) => {
  const soundOutput = sendRequestToTv(connection, WebOSEndpoints.GET_SOUND_OUTPUT);
  return res.status(200).json(soundOutput);
});

router.post("/", (req: Request, res: Response) => {
  const soundOutput = sendRequestToTv(connection, WebOSEndpoints.SET_SOUND_OUTPUT, { output: req.body.output });
  return res.status(200).json(soundOutput);
});

export default router;
