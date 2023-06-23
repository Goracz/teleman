import { Request, Response, Router } from "express";
import { connection } from "../../index";
import { WebOSEndpoints } from "../../constants/webos-endpoints";

const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  await new Promise((resolve, reject) => {
    connection.request(
      WebOSEndpoints.INSERT_TEXT,
      { text: req.body.text },
      (err, res) => {
        if (!err) resolve(res);
        else reject(err);
      }
    );
  });
  return res.status(200).json({
    response: {
      message: "OK",
    },
  });
});

export default router;
