import { Router } from "express";
import { Request,Response } from "express";
import { createWorkflow, getAllWorkflows, getWorkflowById, updateWorkflow } from "../controller/workflowRouter";

const router = Router()

router.post("/create",createWorkflow)

router.get("/",getAllWorkflows)

router.get("/:id",getWorkflowById)

router.put("/:id",updateWorkflow)

export const workflowRouter = router

