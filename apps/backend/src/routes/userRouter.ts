import { Router } from "express";
import { Request,Response } from "express";
import { userSignin, userSignup } from "../controller/userController.js";

const router = Router()

router.post("/signup",userSignup)

router.post("/signin",userSignin)

export const userRouter = router