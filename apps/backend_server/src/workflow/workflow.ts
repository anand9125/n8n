import express from "express"
import type { Request, Response, Router } from "express"
import authentication from "../middleware/auth.js"
import { prismaClient } from "@repo/db/client"

const workFlowRouter: Router = express.Router()

async function postWorkFlowRouterFunction(req: any, res: Response){

    function generateRandomTitle() {
        const adjectives = ["Fast", "Smart", "Cool", "Dynamic", "Flow"];
        const nouns = ["Workflow", "Engine", "Pipeline", "System", "Graph"];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const rand = Math.floor(Math.random() * 1000);

        return `${adj} ${noun} ${rand}`;
    }

    const user = req.user

    const created = await prismaClient.workflow.create({
        data: {
            userId: String(user.id),
            title: generateRandomTitle(),
            enabled: false,
            flow: ""
        }
    })

    res.send(created.id)
}

async function getWorkFlowRouterFunction(req: any, res:Response){
    const userId = req.user.id
    const data = await prismaClient.workflow.findMany({
        where:{
            userId: userId
        }
    })
    res.send(data)
}

async function putWorkFlowRouterFunction(req: any, res: Response) {
  const userId = req.user.id;
  const workflowId = req.body.workFlowId;
  const title = req.body.title;
  const enabled = req.body.enabled;
  const flow = req.body.flow;

  const existing = await prismaClient.workflow.findFirst({
    where: { id: workflowId, userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Workflow not found or access denied" });
  }

  const updatedData = await prismaClient.workflow.update({
    where: { id: workflowId },
    data: { enabled, flow, title },
  });
  return res.json(updatedData);
}

async function getSingleWorkFlowRouterFunction(req: any, res: Response) {
  const flowId = req.query.flowId as string;
  const userId = req.user.id;
  if (!flowId) {
    return res.status(400).json({ error: "Missing flowId" });
  }
  const data = await prismaClient.workflow.findFirst({
    where: { id: flowId, userId },
  });
  if (!data) {
    return res.status(404).json({ error: "Workflow not found" });
  }
  return res.json(data);
}


workFlowRouter.put("/", authentication, putWorkFlowRouterFunction)
workFlowRouter.post("/", authentication, postWorkFlowRouterFunction)
workFlowRouter.get("/", authentication, getWorkFlowRouterFunction)
workFlowRouter.get("/singleworkflow", authentication, getSingleWorkFlowRouterFunction)

export default workFlowRouter

