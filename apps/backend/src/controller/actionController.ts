import { Request,Response } from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
export const createAvailaAction = async (req: Request, res: Response) => {
    try{
        const {name,image} = req.body;
        const action = await prisma.availableAction.create({
            data:{
                name,
                image
            }
        })
        res.status(200).json({
            message: "Action created successfully",
            action
        })
    }catch(err){
        res.status(500).json({
            message: "Error creating action",
            error: err
        })
    }
    
}

export const getAvailableActionById = async (req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const action = await prisma.availableAction.findUnique({
            where:{
                id
            }
        })
        res.status(200).json({
            message: "Action fetched successfully",
            action
        })
    }catch(err){
        res.status(500).json({
            message: "Error fetching action",
            error: err
        })
    }
}

export const getAvailableActions = async (req: Request, res: Response) => {
  try{
      const actions = await prisma.availableAction.findMany()
    res.status(200).json({
        message: "Actions fetched successfully",
        actions
    })
  }catch(err){
      res.status(500).json({
          message: "Error fetching actions",
          error: err
      })
  }
}

export const updateAvailableAction = async (req: Request, res: Response) => {        
    const {id} = req.params;
    const {name, image} = req.body;
    try{
        const action = await prisma.availableAction.update({
            where:{
                id
            },
            data:{
                name,
                image
            }
        })
        res.status(200).json({
            message: "Action updated successfully",
            action
        })
    }catch(err){
        res.status(500).json({
            message: "Error updating action",
            error: err
        })
    }
}