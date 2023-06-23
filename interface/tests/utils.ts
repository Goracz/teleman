import express, { Router } from "express";

const createTestEnvironment = (router: Router, path: string) => {
  const app = express();
  app.use(express.json());
  app.use(path, router);

  return { app };
};

export default createTestEnvironment;
