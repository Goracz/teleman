import { Router, Request, Response } from "express";
import { connection } from "../..";
import { WebOSEndpoints } from "../../constants/webos-endpoints";
import { sendRequestToTv } from "../../utils/utils";

const router: Router = Router();

router.get("/", (_: Request, res: Response) => {
  const volume = sendRequestToTv(connection, WebOSEndpoints.GET_VOLUME);
  return res.status(200).json(volume);
});

router.post("/", (req: Request, res: Response) => {
  const desiredVolume: number = req.body.volume;
  const response = sendRequestToTv(connection, WebOSEndpoints.SET_VOLUME, {
    volume: desiredVolume,
  });
  return res.status(200).json(response);
});

router.post("/up", (_: Request, res: Response) => {
  const response = sendRequestToTv(connection, WebOSEndpoints.VOLUME_UP);
  return res.status(200).json(response);
});

router.post("/down", (_: Request, res: Response) => {
  const response = sendRequestToTv(connection, WebOSEndpoints.VOLUME_DOWN);
  return res.status(200).json(response);
});

router.post("/mute", (req: Request, res: Response) => {
  const desiredState: boolean = req.body.mute;
  const response = sendRequestToTv(connection, WebOSEndpoints.SET_MUTE, { mute: desiredState });
  return res.status(200).json(response);
});

export default router;
