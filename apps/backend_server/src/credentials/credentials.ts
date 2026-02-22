import express from "express"
import type {Request, Response, Router} from "express"
import authentication  from "../middleware/auth.js"
import { prismaClient } from "@repo/db/client"

const credentialsRouter: Router = express.Router()

async function credentialsRouterPostFunction(req: any, res: Response){

    const userId = req.user?.id
    const type = req.body.type
    const credential = req.body.credential
    const title = req.body.title

    try{
        const response = await prismaClient.credentials.create({
            data:{
                type: type,
                credential: credential,
                title: title,
                userId: userId
            }
        })

        if(response){
        res.status(200).send(response)
        } 
    } catch(e){
        res.status(400).send("Error uploading credentials: " + e)
    }
}

async function credentialsRouterGetFunction(req: any, res: Response){
    
    const userId = req.user.id

    try{
        const response = await prismaClient.credentials.findMany({
            where:{
                userId: userId
            }
        })

        if(response){
            res.status(200).send(response)
        }
    } catch(e){
        res.status(401).send("Error fetching data"+e)
    }

}

async function credentialsRouterPutFunction(req: any, res: Response){
    
    const userId = req.user.id
    const credentialId = req.body.credentialId
    const credential = req.body.credential

    try{
        const response = await prismaClient.credentials.update({
            where:{
                id: credentialId
            }, 
            data:{
                credential: credential
            }
        })

        if(response){
            res.status(200).send(response)
        }
    } catch(e){
        res.status(401).send("Error Updating data"+e)
    }

}

credentialsRouter.post("/", authentication, credentialsRouterPostFunction)
credentialsRouter.get("/", authentication, credentialsRouterGetFunction)
credentialsRouter.put("/", authentication, credentialsRouterPutFunction)
export default credentialsRouter