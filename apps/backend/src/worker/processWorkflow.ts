import { ActionResponse } from "../types/type";
import { sendMail, sendMailAndWait } from "./email";
import { sendTelegramMessage, sendTelegramMessageAndWait } from "./telegram";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const sendWorkflowForProcess = async ( workflow: any,inputData: any,startFromActionId?: string,execution?: ActionResponse) => {
  
   let startIndex = 0;
   if (startFromActionId && execution && startFromActionId!="WORKFLOW_COMPLETED"){
      startIndex = workflow.actions.findIndex((a: any) => a.id === startFromActionId); 
    }
    else if(startFromActionId=="WORKFLOW_COMPLETED"&&execution){
       console.log(`[Workflow] Execution ${execution.id} finished, no more actions.`);
        await prisma.workflow.update({
            where: { id: execution.workflowId },
            data: { status:"SUCCESS" }
        });
        return; 
    }
  

  // loop through workflow actions
    for (let i = startIndex; i < workflow.actions.length; i++) {
      const action = workflow.actions[i];
      console.log("this is startIndex",startIndex)
      console.log("this is action lrnght",action.length)
      console.log("[Workflow] running action:", action.availableActionId);

      switch (action.availableActionId){
        case "resend":
          if (action.metadata.actionData.selectedAction === "send" && !action.metadata.actionData.previousActionData) {
            await sendMail(action, inputData);

          }else if (action.metadata.actionData.selectedAction === "sendAndWait" && !action.metadata.actionData.previousActionData) {
            console.log("[Workflow] sendMailAndWait triggered");
            const execution = await sendMailAndWait(workflow, action, inputData);

            //  stop execution here and return, workflow will be resumed later
            console.log(
              `[Workflow] Execution paused at action ${action.id}, waiting for reply...`
            );
          return execution; // <--- stop loop until webhook resumes workflow
          }
          break;

        case "telegram":
          if (action.metadata.actionData.selectedAction === "send" && !action.metadata.actionData.previousActionData){
            await sendTelegramMessage(
              inputData,
              action
            );
          } else if (action.metadata.actionData.selectedAction === "sendAndWait" && !action.metadata.actionData.previousActionData){
            console.log("[Workflow] sendTelegramMessageAndWait triggered");
            await sendTelegramMessageAndWait(
              inputData,
              action,
              workflow
            );

            //  stop execution here and return
            console.log(
              `[Workflow] Execution paused at action ${action.id}, waiting for reply...`
            );
          return execution; // <--- stop loop until webhook resumes workflow
          }
          break;

        case "AI-Agents":
          for (const sub of action.subnodes) {
            switch (sub.subnodeName) {
              case "OpenAI":
                console.log("OpenAI agent running");
                break;
              case "Gemini":
                console.log("Gemini agent running");
                break;
              case "Ollama":
                console.log("Ollama agent running");
                break;
              case "Add":
                console.log("Perform Add");
                break;
              case "Subtract":
                console.log("Perform Subtract");
                break;
              case "Multiply":
                console.log("Perform Multiply");
                break;
            }
          }
          break;

        default:
          console.log(`[Workflow] Unknown action type: ${action.availableActionId}`);
          break;
      }
    }


  console.log("[Workflow] Completed all actions for workflow", workflow.id);
};
