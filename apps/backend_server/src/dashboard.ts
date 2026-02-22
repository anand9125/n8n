import express from "express";
import type { Request, Response, Router } from "express";
import authentication from "./middleware/auth.js";

const dashboardRouter: Router = express.Router();

async function dashboardRouterFunction(req: any, res: Response) {
  if (req.user) {
    return res.json({ user: req.user });
  }
  return res.status(401).json({ message: "Unauthorized" });
}

dashboardRouter.get("/", authentication, dashboardRouterFunction);

export default dashboardRouter;