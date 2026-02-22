import express, { Router } from "express";
import type { Request, Response } from "express";
import authentication from "../middleware/auth.js";
import { prismaClient } from "@repo/db/client";

const workFlowStatusRouter: Router = express.Router();

async function getWorkFlowStatusRouterFunction(req: Request, res: Response) {
  try {
    const flowId = req.query.flowId as string | undefined;

    if (!flowId) {
      return res.status(400).json({ error: "Missing flowId" });
    }

    const data = await prismaClient.jobs.findMany({
      where: { workflowID: flowId },
      select: {
        id: true,
        status: true,
        node: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" }, // optional: newest first
    });

    return res.json(data);
  } catch (err: any) {
    console.error("Error fetching workflow status:", err);
    return res.status(500).json({ error: "Failed to fetch workflow status" });
  }
}

async function deleteWorkFlowStatusRouterFunction(req: Request, res: Response) {
  try {
    const flowId = req.query.flowId as string | undefined;

    if (!flowId) {
      return res.status(400).json({ error: "Missing flowId" });
    }

    const data = await prismaClient.jobs.deleteMany({
      where: { workflowID: flowId },
    });

    console.log(data)
    return res.json(data);
  } catch (err: any) {
    console.error("Error fetching workflow status:", err);
    return res.status(500).json({ error: "Failed to fetch workflow status" });
  }
}

workFlowStatusRouter.get("/", authentication, getWorkFlowStatusRouterFunction);
workFlowStatusRouter.delete("/del", authentication, deleteWorkFlowStatusRouterFunction);

export default workFlowStatusRouter;
