import { Request,Response } from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const createCredentials = async (req: Request, res: Response) => {
    try{
        const {title,platform,credentials,description,userId} = req.body;
        const credential = await prisma.credentials.create({
            data:{
                userId,
                title,
                platform,
                credentials,
                description
            }
        })
        res.status(200).json({
            message: "Credential created successfully",
            credential
        })
    }catch(err){
        res.status(500).json({
            message: "Error creating credential",
            error: err
        })
    }
    
}

export const getCredentialsById = async (req: Request, res: Response) => {
    const id = req.params 
    try{
        const credential = await prisma.credentials.findUnique({
            where:{
                id: Number(id)
            }
        })
        res.status(200).json({
            message: "Credential fetched successfully",
            credential
        })
    }catch(err){
        res.status(500).json({
            message: "Error fetching credential",
            error: err
        })
    }
}

export const getCredentials = async (req: Request, res: Response) => {
    try{
        const credentials = await prisma.credentials.findMany()
        res.status(200).json({
            message: "Credentials fetched successfully",
            credentials
        })
    }catch(err){
        res.status(500).json({
            message: "Error fetching credentials",
            error: err
        })
    }
}

export const updateCredentials = async (req: Request, res: Response) => {     
    const {id} = req.params;
    const {title, platform, credentials, description} = req.body;
    try{
        const credential = await prisma.credentials.update({
            where:{
                id:Number(id)
            },
            data:{
                title,
                platform,
                credentials,
                description
            }
        })
        res.status(200).json({
            message: "Credential updated successfully",
            credential
        })
    }catch(err){
        res.status(500).json({
            message: "Error updating credential",
            error: err
        })
    }
}

export const deleteCredentials = async (req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const credential = await prisma.credentials.delete({
            where:{
                id:Number(id)
            }
        })
        res.status(200).json({
            message: "Credential deleted successfully",
            credential
        })
    }catch(err){
        res.status(500).json({
            message: "Error deleting credential",
            error: err
        })
    }
}       