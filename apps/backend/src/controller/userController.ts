import { Request,Response } from "express";
import {PrismaClient} from "@prisma/client";
import { JWT_SECRET } from "../types/type";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const userSignup = async (req: Request, res: Response) => { 
    try{
        const {email,password,name} = req.body;
        const User = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(User){
            res.status(400).json({
                message: "User already exists"
            })
            return 
        }
        const user = await prisma.user.create({
            data:{
               
                email,
                password,
                name
            }
        })
        res.status(200).json({
            message: "User created successfully",
            user
        })
    }catch(err){
        res.status(500).json({
            message: "Error creating user",
            error: err
        })
    }
   
};

export const userSignin = async (req: Request, res: Response) => {
    try{
        const{email,password} = req.body;
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            res.status(404).json({
                message: "User not found pls login"
            })
            return
        }
        if(user.password === password){
            const token = jwt.sign({id:user.id},JWT_SECRET);
            res.status(200).json({
                message: "User logged in successfully",
                user,
                token
            })   
        }
    }catch(err){
        res.status(500).json({
            message: "Error logging in user",
            error: err
        })
    }
};