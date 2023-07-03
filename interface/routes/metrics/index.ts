import { Request, Response, Router } from "express";
import client from "../../metrics";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  res.set("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.end(metrics);
});

export default router;
