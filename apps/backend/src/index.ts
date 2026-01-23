import express, { Response ,Request} from "express";
import cors from "cors";
import { userRouter } from "./routes/userRouter.js";
import { workflowRouter } from "./routes/workflowRouter.js";
import { triggerRouter } from "./routes/triggerRouter.js";
import { actionRouter } from "./routes/actions.js";
import { credentialRouter } from "./routes/credentialsRouter.js";
import { webhookRouter } from "./worker/webhook.js";


import { postmarkRouter } from "./worker/email.js";

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/v1/user",userRouter)

app.use("/api/v1/workflow",workflowRouter)

app.use("/api/v1/avaialbleTriggers",triggerRouter)

app.use("/api/v1/avaialbleActions",actionRouter)

app.use("/api/v1/credentials",credentialRouter)

app.use("/api/v1/workflow",webhookRouter)

app.use("/api/v1/postmark",postmarkRouter)

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

});






app.listen(4000, () => {   
    console.log("Server is running on port 4000");   
});
