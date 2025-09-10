import { Request,Response } from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
export const createAvailableTrigger = async (req: Request, res: Response) => {
    try{
        const {name,image} = req.body;
        const trigger = await prisma.availableTriggers.create({
            data:{
                name,
                image
            }
        })
        res.status(200).json({
            message: "Trigger created successfully",
            trigger
        })
    }catch(err){
        res.status(500).json({
            message: "Error creating trigger",
            error: err
        })
    }
    
}

export const getAvailableTriggersById = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const trigger = await prisma.availableTriggers.findUnique({
            where:{
                id
            }
        })
        res.status(200).json({
            message: "Trigger fetched successfully",
            trigger
        })
    }catch(err){
        res.status(500).json({
            message: "Error fetching trigger",
            error: err
        })
    }
    
}

export const getAvailableTriggers = async (req: Request, res: Response) => {
    try{
        const triggers = await prisma.availableTriggers.findMany()
        res.status(200).json({
            message: "Triggers fetched successfully",
            triggers
        })  
    }catch(err){
        res.status(500).json({
            message: "Error fetching triggers",
            error: err
        })
    }
    
}

export const updateAvailableTriggers = async (req: Request, res: Response) => {     
    const {id} = req.params;
    const {name, image} = req.body;
    try{
        const trigger = await prisma.availableTriggers.update({
            where:{
                id
            },
            data:{
                name,
                image
            }
        })
        res.status(200).json({
            message: "Trigger updated successfully",
            trigger
        })
    }catch(err){
        res.status(500).json({
            message: "Error updating trigger",
            error: err
        })
    }
}