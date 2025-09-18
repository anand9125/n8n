import express, { Response ,Request} from "express";
import cors from "cors";
import { userRouter } from "./routes/userRouter";
import { workflowRouter } from "./routes/workflowRouter";
import { triggerRouter } from "./routes/triggerRouter";
import { actionRouter } from "./routes/actions";
import { credentialRouter } from "./routes/credentialsRouter";
import { webhookRouter } from "./worker/webhook";

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/v1/user",userRouter)

app.use("/api/v1/workflow",workflowRouter)

app.use("/api/v1/avaialbleTriggers",triggerRouter)

app.use("/api/v1/avaialbleActions",actionRouter)

app.use("/api/v1/credentials",credentialRouter)

app.use("/api/v1/workflow",webhookRouter)

app.post("/api/v1/test", (req: Request, res: Response) => {
  const { nodes, edges, workflowId, userId } = req.body;

   console.log(nodes)
   console.log(edges)
   console.log(workflowId)
   nodes.forEach((node: any) => {
    console.log(node);
  })
  edges.map((edge: any) => {
    console.log(edge);
  })

   // console.log(workflowData, "==> extracted workflow data");
});






app.listen(4000, () => {   
    console.log("Server is running on port 4000");   
});