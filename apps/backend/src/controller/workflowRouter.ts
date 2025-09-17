import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";
import { workflowSchema } from "../types/type";
const prisma = new PrismaClient();

export const createWorkflow = async (req: Request, res: Response) => {
    try{
        console.log("some one hit me");
        const { nodes, edges, workflowId, userId } = req.body;
        let triggerNodeId = "";
        let triggerMetadata = {};
        let triggerPositionX = 0;
        let triggerPositionY = 0;
        console.log("reached here 1")

        const actions: Array<{
            availableActionId: string;
            actionMetadata: any;
            positionX: number;
            positionY: number;
        }> = [];
        const edge:Array<{
          id: string;
          source: string;
          target: string;
        }> = [];
        console.log("reached here 5")

        nodes.forEach((node: any) => {
            if (node.type === "trigger") {
            triggerNodeId = node.data.triggerNodeId;
            triggerMetadata = node.data.metadata;
            triggerPositionX = node.position.x;
            triggerPositionY = node.position.y;
            }

            if (node.type === "action") {
            actions.push({
                availableActionId: node.data.actionNodeId,
                actionMetadata: node.data.metadata,
                positionX: node.position.x,
                positionY: node.position.y,
            });
            }
        });
        console.log("reached here 6")
        const simplifiedEdges = edges.map((edge: any) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
        }));

        console.log("reached here")
        console.log(simplifiedEdges)
        console.log(workflowId)
        console.log(userId)
        console.log(triggerNodeId)
        console.log(triggerMetadata)
        console.log(triggerPositionX)
        console.log(triggerPositionY)   
        console.log(actions)


        const workflow = await prisma.$transaction(async(tx)=>{
            console.log("reached here 7")
                        console.log("workflowId:", workflowId);
            console.log("userId:", userId);
            console.log("actions array:", actions);

            const workflow = await prisma.workflow.create({
                data:{
                    id:workflowId,
                    userId:userId,
                    triggerId:"",
                    actions:{  
                        create:actions.map((x,index)=>({  //this refer arrays of actions objects
                            //the map function itrate over each element(x) and give the current indexes to
                            availableActionId:x.availableActionId,
                            sortingOrder:index,
                            metadata:x.actionMetadata,
                            positionX:x.positionX,
                            positionY:x.positionY

                        }))
                    }    
                }  
            })
            console.log("reached here 2")
            const trigger = await prisma.trigger.create({
                data:{
                    workflowId:workflowId,
                    availableTriggersId:triggerNodeId,
                    metadata:triggerMetadata,
                    positionX:triggerPositionX,
                    positionY:triggerPositionY

                }
            })
            console.log("reached here 3")
            await prisma.workflow.update({
                where:{
                    id:workflowId
                },
                data:{
                    triggerId:trigger.id
                }
            })
            console.log("reached here 4")
            await prisma.edge.createMany({
                data: simplifiedEdges.map((x:any, index:any) => ({
                    id: x.id,
                    workflowId: workflowId,
                    sourceNodeId: x.source,
                    targetNodeId: x.target,
                }))
            });

            return workflow
        })
        res.status(200).json({
            message: "Workflow created successfully",
            workflow
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Error creating workflow",
            error: err,
           

        })
    }
}        

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