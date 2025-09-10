import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRouter";
import { workflowRouter } from "./routes/workflowRouter";

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/v1/users",userRouter)

app.use("/api/v1/workflow,",workflowRouter)




app.listen(3000, () => {   
    console.log("Server is running on port 3000");   
});