import { Router, Request, Response } from 'express';
import {PrismaClient} from "@prisma/client"; // Make sure the correct prisma import path is used
import { sendWorkflowForProcess } from './processWorkflow';
import { getWorkflow } from './getWorkflow';

const prisma = new PrismaClient();
const router = Router();

router.post("/:userId/:workflowId", async (req: Request, res: Response) => {
    const { userId, workflowId } = req.params;
    const inputData = req.body;
    try {
          const workflow = await getWorkflow(workflowId as string);
        console.log("reached here")

         sendWorkflowForProcess(workflow,inputData);

        if (!workflow) {
             res.status(404).json({
                message: "Workflow not found",
            
            });
        return
        }
        // TODO: Execute workflow logic here
        res.status(200).json({
            message: "Workflow executed successfully",
            workflow
        });

    } catch (err) {
          res.status(500).json({
            message: "Error executing workflow",
            error: err instanceof Error ? err.message : err,
        });
    }
});

export const webhookRouter = router;
