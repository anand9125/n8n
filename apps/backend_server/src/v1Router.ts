import express from "express"
import type { Router, Response, Request } from "express"
import cookieParser from "cookie-parser";
import dashboardRouter from "./dashboard.js";
import workFlowRouter from "./workflow/workflow.js";
import credentialsRouter from "./credentials/credentials.js";
import excecutionRouter from "./exec/exec.js";
import signUpRouter from "./auth/singup.js";
import signInRouter from "./auth/signin.js";
import workFlowStatusRouter from "./workflow/status.js";

const v1Router: Router = express.Router()

v1Router.use("/signup", signUpRouter)
v1Router.use("/signin", signInRouter)
v1Router.use(cookieParser())
v1Router.use("/dashboard", dashboardRouter)
v1Router.use("/workflow", workFlowRouter)
v1Router.use("/credentials", credentialsRouter)
v1Router.use("/excecution", excecutionRouter)
v1Router.use("/status", workFlowStatusRouter)

v1Router.get("/", (req: Request,res: Response) => {
    res.send("Hello v1 world!!")
})

export default v1Router