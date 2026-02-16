import { Response } from "express";
import { AuthRequest } from "../routes/credentials.js";
import prisma from "../lib.js";

export const getWorkflows = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
         res.status(401).json({ message: "User not found" });
         return
    }

    const workflows = await prisma.workflow.findMany({
        where: { userId },
        include: {
            nodes: true,
            webhook: true,
            executions: {
                orderBy: { createdAt: "desc" },
                take: 10,
            },
        },
    });

     res.json({
        message: "Workflows fetched successfully",
        workflows,
    });
    return
};

export const createWorkflow = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
         res.status(401).json({ message: "User not found" });
         return
    }

    const { title, triggerType, nodesJson, connections } = req.body;

    const workflow = await prisma.workflow.create({
        data: {
            title,
            userId,
            triggerType: triggerType || "MANUAL",
            nodesJson,
            connections,
            enabled: false,
        },
    });

    res.json({
        message: "Workflow created successfully",
        workflow,
    });
    return 
};

export const updateWorkflow = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "User not found" });
         return
    }

    const { workflowId } = req.params;
    const { title, nodesJson, connections, enabled } = req.body;

    // Verify the workflow belongs to the user
    const existingWorkflow = await prisma.workflow.findFirst({
        where: { id: workflowId, userId },
    });

    if (!existingWorkflow) {
        res.status(404).json({ message: "Workflow not found" });
        return 
    }

    const workflow = await prisma.workflow.update({
        where: { id: workflowId },
        data: {
            ...(title && { title }),
            ...(nodesJson && { nodesJson }),
            ...(connections && { connections }),
            ...(enabled !== undefined && { enabled }),
        },
    });

     res.json({
        message: "Workflow updated successfully",
        workflow,
    });
    return
};

export const getWorkflowById = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "User not found" });
         return
    }

    const { workflowId } = req.params;

    const workflow = await prisma.workflow.findFirst({
        where: { id: workflowId, userId },
        include: {
            nodes: true,
            webhook: true,
            executions: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!workflow) {
        res.status(404).json({ message: "Workflow not found" });
        return 
    }

    res.json({
        message: "Workflow fetched successfully",
        workflow,
    });
     return
};

export const deleteWorkflow = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
         res.status(401).json({ message: "User not found" });
         return
    }

    const { workflowId } = req.params;

    // Verify the workflow belongs to the user
    const existingWorkflow = await prisma.workflow.findFirst({
        where: { id: workflowId, userId },
    });

    if (!existingWorkflow) {
        res.status(404).json({ message: "Workflow not found" });
         return
    }

    await prisma.workflow.delete({
        where: { id: workflowId },
    });

     res.json({
        message: "Workflow deleted successfully",
    });
    return
};
