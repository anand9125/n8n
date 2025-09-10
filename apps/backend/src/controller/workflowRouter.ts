import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";
import { workflowSchema } from "../types/type";
const prisma = new PrismaClient();

export const createWorkflow = async (req: Request, res: Response) => {
    try{
        const parseData = workflowSchema.safeParse(req.body);
            if(!parseData.success){
            res.status(400).json({message:"Invalid data"});
            return;
        } 
        const zapId = await prisma.$transaction(async(tx)=>{
            const workflow = await prisma.workflow.create({
                data:{
                    userId:parseData.data.userId,
                    triggerId:"",
                    actions:{  
                        create:parseData.data.actions.map((x,index)=>({  //this refer arrays of actions objects
                            //the map function itrate over each element(x) and give the current indexes to
                            availableActionId:x.availableActionId,
                            sortingOrder:index,
                            metadata:x.actionMetadata
                        }))
                    }    
                }  
            })
            const trigger = await prisma.trigger.create({
                data:{
                    availableTriggersId:parseData.data.avaialbleTriggersId,
                    workflowId:workflow.id,
                    metadata:parseData.data.triggerMetadata
                }
            })
            await prisma.workflow.update({
                where:{
                    id:workflow.id
                },
                data:{
                    triggerId:trigger.id
                }
            })
            return workflow.id
        })
        res.status(200).json({
            message: "Workflow created successfully",
            workflowId:zapId
        })
    }catch(err){
        res.status(500).json({
            message: "Error creating workflow",
            error: err
        })
    }
}        

export const getAllWorkflows = async (req: Request, res: Response) => {
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

export const updateWorkflow = async (req: Request, res: Response) => {
    
}