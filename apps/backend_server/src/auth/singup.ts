import express from "express"
import type  {Request, Response, Router} from "express"
import { prismaClient } from "@repo/db/client"
import bcrypt from "bcrypt"

const signUpRouter: Router = express.Router()

async function signUpRouterFunction(req: Request, res: Response){
    
    const email = req.body.email;
    const password = req.body.password;
    
    const foundUser = await prismaClient.user.findUnique({
        where:{
            email: email
        }
    })

    console.log(foundUser)
    if (foundUser){
        res.status(400).json({
            message: "User Already Exists"
        })
    }

    else{

        const hashedPassword = await bcrypt.hash(password, 10)

        console.log(hashedPassword)

        const userCreated = await prismaClient.user.create({
            data:{
                email: email,
                password: hashedPassword
            }
        })

        if (userCreated){
            res.status(200).json({
                message: "User Created Successfully"
            })
        }
    }
}

signUpRouter.post("/", signUpRouterFunction)

export default signUpRouter