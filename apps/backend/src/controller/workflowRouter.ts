import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";
import { CustomRequest } from "../middlewares/userMiddlewares";
const prisma = new PrismaClient();


export const createWorkflow = async (req: CustomRequest, res: Response) => {
    try {
        const { nodes, edges, workflowId } = req.body;
        const workflowTitle =req.body.title; 
        const userId = req?.id as string;
        let isFormBuilder = false;
        let formRoute;
        let formId;

        let triggerNodeId = '';
        let triggerMetadata = {};
        let triggerPositionX = 0;
        let triggerPositionY = 0;

        const actionsInput: Array<{
            availableActionId: string;
            actionMetadata: any;
            positionX: number;
            positionY: number;
            nodeId: string;
        }> = [];

        const subnodesInput: Array<{
            subnodeName : string;
            subnodeMetadata: any;
            positionX: number;
            positionY: number;
            parentNodeId: string;
        }> = [];
        

        nodes.forEach((node: any) => {
            if (node.type === 'trigger') {
                triggerNodeId = node.data.triggerNodeId;
                if(node.data.triggerNodeId === "form-builder-1"){
                    isFormBuilder = true;
                    formId=node.data.metadata.actionData.id;
                }
                triggerMetadata = node.data.metadata;
                triggerPositionX = node.position.x;
                triggerPositionY = node.position.y;
            }

            if (node.type === 'action') {
                actionsInput.push({
                    availableActionId: node.data.actionNodeId,
                    actionMetadata: node.data.metadata,
                    positionX: node.position.x,
                    positionY: node.position.y,
                    nodeId: node.id, // Store the node id for linking later
                });
            }

            if (node.type === 'subnode') {
                subnodesInput.push({
                    subnodeName: node.data.subnodeNodeId,
                    subnodeMetadata: node.data.metadata,
                    positionX: node.position.x,
                    positionY: node.position.y,
                    parentNodeId: node.data.parentActionNodeId, // action node id it belongs to
                });
            }
        });

        const simplifiedEdges = edges.map((edge: any) => ({
            source: edge.source,
            target: edge.target,
        }));

        const workflow = await prisma.$transaction(async (tx) => {
           const createdWorkflow = await tx.workflow.create({
                data: {
                    id: workflowId,
                    title: workflowTitle,
                    userId,
                    triggerId: '',
                    actions: {
                        create: actionsInput.map((action, index) => ({
                            availableActionId: action.availableActionId,
                            sortingOrder: index,
                            metadata: action.actionMetadata,
                            positionX: action.positionX,
                            positionY: action.positionY,
                        })),
                    },
                },
                include: { actions: true },  // Important to get action IDs
            });

            const trigger = await tx.trigger.create({
                data: {
                    workflowId: workflowId,
                    availableTriggersId: triggerNodeId,
                    metadata: triggerMetadata,
                    positionX: triggerPositionX,
                    positionY: triggerPositionY,
                },
            });

            await tx.workflow.update({
                where: { id: workflowId },
                data: { triggerId: trigger.id },
            });

            await tx.edge.createMany({
                data: simplifiedEdges.map((edge: any) => ({
                    workflowId: workflowId,
                    sourceNodeId: edge.source,
                    targetNodeId: edge.target,
                })),
            });

            // Correct reference to createdWorkflow.actions, NOT workflow.actions
            for (const subnode of subnodesInput) {
                const action = actionsInput.find(a => a.nodeId === subnode.parentNodeId);

                if (action) {
                    const createdAction = createdWorkflow.actions.find(
                        (a) => a.availableActionId === action.availableActionId
                    );

                    if (createdAction) {
                        await tx.subnodesActions.create({
                            data: {

                                subnodeName: subnode.subnodeName,
                                actionId: createdAction.id,
                                metadata: subnode.subnodeMetadata,
                                positionX: subnode.positionX,
                                positionY: subnode.positionY,
                            },
                        });
                    } else {
                        console.error('No created action matched:', {
                            action,
                            workflowActions: createdWorkflow.actions,
                        });
                        throw new Error('Matching created Action not found');
                    }
                } else {
                    console.error(
                        'Subnode missing parent action:',
                        subnode,
                        'Available actions:',
                        actionsInput
                    );
                    throw new Error('Parent action node not found for subnode');
                }
            }

            return createdWorkflow;
        });
        if(isFormBuilder){
            formRoute = `${workflowId}/${userId}/${formId}`;
        }

        res.status(200).json({
            message: 'Workflow created successfully',
            workflow,
            formRoute: formRoute,
        });
    }catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error creating workflow',
            error: err,
        });
    }
};

export const getAllWorkflows = async (req: Request, res: Response) => {
    try{
        const workflows = await prisma.workflow.findMany()
        res.status(200).json({
            message: "Workflows found successfully",
            workflows
        })
    }catch(err){
        res.status(500).json({
            message: "Error getting workflows",
            error: err
        })
    }
}

export const getWorkflowById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try{
        const workflow = await prisma.workflow.findUnique({
            where:{
                id
            },include:{
                actions:{
                    include:{
                        type:true
                    }
                },trigger:{
                    include:{
                        type:true
                    }
                }
            }
        })
        if(!workflow){
            res.status(404).json({
                message: "Workflow not found pls login"
            })
            return
        }
        res.status(200).json({
            message: "Workflow found successfully",
            workflow
        })
    }catch(err){
        res.status(500).json({
            message: "Error getting workflow",
            error: err
        })
    }
}

export const updateWorkflow = async (req: Request, res: Response) =>{
    
}