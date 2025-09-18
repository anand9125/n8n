import { sendMail, sendTelegramMessage } from "./Helper";

export const sendWorkflowForProcess = async(workflow: any,inputData: any) => {
    //TODO :Run workflow 
    console.log("startin workflow")
    for(const action of workflow.actions){  //the outer for loop will run once for each item in workflow.actions
        switch(action.availableActionId){
            case "resend":
                console.log("resend action")
                await sendMail(
                    action.metadata.actionData.config.resendApi,
                    action.metadata.actionData.config.fromEmail,
                    inputData.emailId,
                    action.metadata.actionData.config.subject,
                    action.metadata.actionData.config.body
                )
                break;
              
            case "telegram":
                console.log("telegram action")
                await sendTelegramMessage(
                    inputData.chatId,
                    action.metadata.actionData.config.botToken,
                    action.metadata.actionData.config.message
                )
                break;
            
            case "AI-Agents":
                for(const sub of action.subnodes){
                    switch(sub.subnodeName){
                        case "OpenAI":
                            console.log("OpenAI")
                            break;
                        case "Gemini":
                            console.log("Gemini")
                            break;
                        case "Ollama":
                            console.log("Ollama")
                            break;
                        case "Add":
                            console.log("Add")
                            break;
                        case "Subtract":
                            console.log("Subtract") 
                            break;
                        case "Multiply":
                            console.log("Multiply")
                            break;
                    }
                }
            break;
        }
    }
};  