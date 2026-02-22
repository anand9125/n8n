// Execute workflow: enqueue nodes to the worker. Called when user presses Execute on the frontend.
import express, { Router } from "express";
import type { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { nodeQueue } from "@repo/worker-core";
import authentication from "../middleware/auth.js";

const excecutionRouter: Router = express.Router();

async function excecuteRouterFunction(req: Request, res: Response) {
  try {
    const workFlowId = req.body.workFlowId;
    const userId = (req as any).user?.id;

    if (!workFlowId) {
      return res.status(400).json({ success: false, error: "Missing workFlowId" });
    }

    const workFlow = await prismaClient.workflow.findFirst({
      where: { id: workFlowId },
    });

    if (!workFlow) {
      return res.status(404).json({ success: false, error: "Workflow not found" });
    }

    if (workFlow.userId !== userId) {
      return res.status(403).json({ success: false, error: "Not allowed to run this workflow" });
    }

    if (!workFlow.flow) {
      return res.status(400).json({ success: false, error: "Workflow has no flow data" });
    }

    const workFlowObject: {
      nodes: { id: number; type: string; data: object }[];
      edges: object[];
    } = JSON.parse(workFlow.flow);

    for (const node of workFlowObject.nodes) {
      const nodeWithWorkflow = { ...node, workflowId: workFlowId };
      await nodeQueue.add(`node-${node.id}`, nodeWithWorkflow);
    }

    return res.json({ success: true, message: "Workflow enqueued" });
  } catch (error) {
    console.error("Error in excecuteRouterFunction:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

excecutionRouter.post("/", authentication, excecuteRouterFunction);

export default excecutionRouter;
