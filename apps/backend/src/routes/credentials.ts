import  { Request, Response } from "express";
import { CredentialsSchema, CredentialsUpdateSchema } from "../types/schema.js";
import prisma from "../lib.js";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
    body: any;
    params: any;
}

export const postCredentials = async (req: AuthRequest, res: Response) => {
    const response = CredentialsSchema.safeParse(req.body);
    if (!response.success) {
        res.status(400)
        .json({ message: "authentication failed, enter the valid credentials"});
         return

    }
    if (!req.user?.id) {
        res.status(401).json({ message: "User not found"})
        return 
    }
    const data = response.data;
    const newCredentials = await prisma.credentials.create({
        data: {
            title: data.title,
            platform: data.platform,
            data: data.data,
            userId: req.user.id,
        }
    });
    res.json({
        message: "Credentials created successfully",
        newCredentials,
    })
     return
};

export const getCredentials = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
         res.status(401)
        .json({ message: "User not found"})
        return
    }
    const credentials = await prisma.credentials.findMany({
        where: { userId },
    });
     res.json({ message: "All Credentials fetched successfully", credentials})
     return
}

export const deleteCredentials = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "User not found" });
         return
    }
    
    const { credentialsId } = req.params;
    const deleteCredentials = await prisma.credentials.delete({
        where: { 
            userId, 
            id: credentialsId,
        }
    });

    res.json({
        message: "Credentials deleted successfully",
        deleteCredentials,
    });
    return 
};

export const updateCredentials = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
         res.status(401).json({ message: "User not found" });
         return
    }
    
    const { credentialsId } = req.params;
    const response = CredentialsUpdateSchema.safeParse(req.body);
    if (!response.success) {
         res.status(400).json({ 
            message: "Invalid credentials data", 
            errors: response.error.issues
        });
        return
    }
    
    const updatedCreds = response.data;
    const updatedCredentials = await prisma.credentials.update({
        where: { 
            userId, 
            id: credentialsId,
        },
        data: {
            ...(updatedCreds.title && { title: updatedCreds.title }),
            ...(updatedCreds.platform && { platform: updatedCreds.platform }),
            ...(updatedCreds.data && { data: updatedCreds.data }),
        }
    });
    
     res.json({
        message: "Credentials updated successfully",
        updatedCredentials,
    });
    return
};