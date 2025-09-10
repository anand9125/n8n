import { Router } from "express";
import { Request,Response } from "express";
import { createWorkflow, getAllWorkflows, getWorkflowById, updateWorkflow } from "../controller/workflowRouter";
import { userMiddlewares } from "../middlewares/userMiddlewares";

const router = Router()

router.post("/create",createWorkflow)

router.get("/",userMiddlewares,getAllWorkflows)

router.get("/:id",userMiddlewares,getWorkflowById)

router.put("/:id",userMiddlewares,updateWorkflow)

export const workflowRouter = router

