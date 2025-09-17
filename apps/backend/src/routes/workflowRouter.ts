import { Router } from "express";
import { Request,Response } from "express";
import { createWorkflow, getAllWorkflows, getWorkflowById, updateWorkflow } from "../controller/workflowRouter";
import { userMiddleware } from "../middlewares/userMiddlewares";

const router = Router()

router.post("/create",userMiddleware,createWorkflow)

router.get("/",userMiddleware,getAllWorkflows)

router.get("/:id",userMiddleware,getWorkflowById)

router.put("/:id",userMiddleware,updateWorkflow)

export const workflowRouter = router

