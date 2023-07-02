import { Router, Request, Response } from "express";
import { connection } from "../..";
import { WebOSEndpoints } from "../../constants/webos-endpoints";
import { sendRequestToTv } from "../../utils/utils";

const router: Router = Router();

router.post("/pause", (_: Request, res: Response) => {
  const response = sendRequestToTv(connection, WebOSEndpoints.PAUSE_PLAYBACK);
  return res.status(200).json(response);
});

router.post("/play", (_: Request, res: Response) => {
  const response = sendRequestToTv(connection, WebOSEndpoints.START_PLAYBACK);
  return res.status(200).json(response);
});

router.post("/fast-forward", (_: Request, res: Response) => {
  const response = sendRequestToTv(connection, WebOSEndpoints.FAST_FORWARD_PLAYBACK);
  return res.status(200).json(response);
});

router.post("/rewind", (_: Request, res: Response) => {
  const response = sendRequestToTv(connection, WebOSEndpoints.REWIND_PLAYBACK);
  return res.status(200).json(response);
});

export default router;
