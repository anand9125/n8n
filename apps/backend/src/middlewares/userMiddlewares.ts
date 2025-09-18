import jwt from "jsonwebtoken";

import { Request, Response } from "express";
import { UUID } from "crypto";
import { JWT_SECRET } from "../types/type";
export interface CustomRequest extends Request {
  id?: UUID;
}


export const userMiddleware = (req: CustomRequest, res: Response, next: any) => {
    const token = req.headers.authorization;
    console.log(token)
     if(token){
      const payload = jwt.verify(token,JWT_SECRET )
      console.log(payload)
      //@ts-ignore
      req.id = payload.userId;
      console.log(req.id)
     next();
    }else{
      res.status(401).json({
        message: "Unauthorized",
      });
    }
};  