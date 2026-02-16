import { Request, Response } from "express";
import { addToQueue } from "../redis/redis.js";
import prisma from "../lib.js";

export async function handleWebhookCall(req: Request, res: Response) {
  try {
    const webhookId = req.params.webhookId;
    const headers = req.headers;
    const query = req.query;
    const rawBody = req.body;

    const workflow = await prisma.workflow.findUnique({
      where: { webhookId },
    });

    if (!workflow) {
      return res.status(404).json({
        error: "No workflow found for this webhook ID",
      });
    }

    const nodes = (workflow.nodesJson as Record<string, any>) ?? {};
    const connections = (workflow.connections as Record<string, string[]>) ?? {};

    let triggerNodeId: string | null = null;

    for (const nodeId in nodes) {
      const node = nodes[nodeId] as any;
      if (node.type === "webhook") {
        triggerNodeId = nodeId;
        break;
      }
    }

    if (!triggerNodeId) {
      return res.status(500).json({
        error: "Workflow does not contain a webhook node",
      });
    }

    const hasForm = Object.values(nodes).some(
      (node: any) =>
        node.type === "form" ||
        node.data?.nodeType === "form"
    );

    const newExecution = await prisma.execution.create({
      data: {
        workflowId: workflow.id,
        status: "PENDING",
        totalTasks: Object.keys(nodes).length,
      },
    });

    let parsedBody = rawBody;
    try {
      if (typeof rawBody === "string") {
        parsedBody = JSON.parse(rawBody);
      }
    } catch {
    }

    const webhookContext = {
      headers,
      body: parsedBody,
      query_params: query,
    };

    const firstJob = {
      id: `${triggerNodeId}-${newExecution.id}`,
      type: "webhook" as const,
      data: {
        executionId: newExecution.id,
        workflowId: workflow.id,
        nodeId: triggerNodeId,
        nodeData: (nodes[triggerNodeId] as any),
        context: webhookContext,
        connections: (connections[triggerNodeId] ?? []) as string[],
      },
    };

    await addToQueue(firstJob);

    return res.json({
      execution_id: newExecution.id,
      workflow_id: workflow.id,
      has_form: hasForm,
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Webhook handler failed" });
  }
}
