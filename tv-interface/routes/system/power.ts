import { Router, Request, Response } from "express";
import { wake } from "wol";
import arp from "@network-utils/arp-lookup";

import { connection, ipAddress, reconnect } from "../..";
import config from "../../environments/environment.local";

const router: Router = Router();

router.post("/on", async (req: Request, res: Response) => {
  try {
    const macAddress: string =
      config.tvMacAddress || ((await arp.toMAC(ipAddress)) as string);

    await wake(macAddress);
    await reconnect();

    res.status(200).json({
      response: {
        message: "OK",
      },
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

router.post("/off", async (req: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe("ssap://system/turnOff", (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      });
    });

    res.json({
      response,
    });
  } catch (err: any) {
    console.error(`Could not turn off TV: ${err.message}`);

    return res.status(500).json({
      response: {
        message: "Could not turn off TV.",
      },
    });
  }
});

router.get("/state", async (req: Request, res: Response) => {
  try {
    let response;

    response = await new Promise((resolve, reject) => {
      connection.subscribe(
        "ssap://com.webos.service.tvpower/power/getPowerState",
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
    // console.error(`Could not get TV state: ${err.message}`);

    return res.status(200).json({
      response: {
        message:
          "TV is currently turned off (or cannot be found on the network).",
      },
    });
  }
});

export default router;
