import type { Request, Response } from "express";
import { SignupSchema, SigninSchema } from "../types/schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib.js";

export const JWT_SECRET = process.env.JWT_SECRET || "123";

export const signup = async (req: Request, res: Response) => {
    try {
        const response = SignupSchema.safeParse(req.body);
        if (!response.success) {
             res.status(400).json({ message: "Authentication failed, enter valid credentials" });
            return
        }

        const user = response.data;

      
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
        });
        
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return
        }

    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        

        const newUser = await prisma.user.create({
            data: {
                email: user.email,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        res.json({ token, user: { id: newUser.id, email: newUser.email } });
        return 
    } catch (error) {
        console.error("Signup error:", error);
         res.status(500).json({ message: "Internal server error" });
         return
    }
};

export const signin = async (req: Request, res: Response) => {
    try {
        const response = SigninSchema.safeParse(req.body);
        if (!response.success) {
             res.status(400).json({ message: "Authentication failed, enter valid credentials" });
             return
        }

        const user = response.data;

       
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
        });
        
        if (!existingUser) {
            res.status(404).json({ message: "User with this email does not exist" });
            return 
        }

      
        const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password, enter the correct password" });
            return 
        }

        const token = jwt.sign({ id: existingUser.id }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
       res.json({ token, user: { id: existingUser.id, email: existingUser.email } });

        return
    } catch (error) {
        console.error("Signin error:", error);
         res.status(500).json({ message: "Internal server error" });
         return
    }
};
    export const logout = async (req: Request, res: Response) => {
        try {
            res.clearCookie("access_token");
             res.json({ message: "Logged out successfully"});
             return
        } catch (error) {
            console.error("Logout error:", error);
            res.status(500).json({ message: "Internal server error"});
             return
        }
    }

