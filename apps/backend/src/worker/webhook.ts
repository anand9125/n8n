import { Router, Request, Response } from 'express';
import {PrismaClient} from "@prisma/client"; // Make sure the correct prisma import path is used

const prisma = new PrismaClient();
const router = Router();

router.post("/:userId/:workflowId", async (req: Request, res: Response) => {
    const { userId, workflowId } = req.params;
    try {
        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId: userId,
            },
            include: {
                actions: {
                    include: {
                        type: true,      
                        subnodes: true,  
                    },
                },
                trigger: {
                    include: {
                        type: true,     
                    },
                },
                edges: true,        
            },
        });

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
