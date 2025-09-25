import axios from "axios";
import {PrismaClient} from "@prisma/client";
import { getNextActionMetadata } from "./email";
import { sendWorkflowForProcess } from "./processWorkflow";
import { getWorkflow } from "./getWorkflow";
import { ActionResponse } from "../types/type";
const inputMetadat:Map<string,any> = new Map();
const prisma = new PrismaClient();
const activePollers: Map<string, { stop: () => void; isActive: boolean }> = new Map();  
const lastUpdateIds: Map<string, number> = new Map();  

const replaceTokens = (template: string, data: Record<string, any>) => {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const value = data[key.trim()];
    return value !== undefined ? String(value) : "";
  });
};

const makeKey = (chatId: string, messageId: number) => //Builds unique key for pending responses map.
  `${chatId}:${messageId}`;

// Clear webhook to prevent conflicts
const clearWebhook = async (botToken: string) => {
  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
    console.log("🗑️ Webhook cleared for bot");
  } catch (err) {
    console.error("Error clearing webhook:", err);
  }
};

const startTelegramPolling = async (botToken: string, targetMessageId: number, chatId: string) => {
  if (activePollers.has(botToken)) {
    const existingPoller = activePollers.get(botToken)!;
    existingPoller.stop();
    activePollers.delete(botToken);
  }
  console.log(" Starting poller for bot token")

  await clearWebhook(botToken);
  
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log(` Starting targeted polling for bot ${botToken} - waiting for reply to message ${targetMessageId}`);

  let retryCount = 0;
  const maxRetries = 3;
  let isActive = true;

  const poll = async () => {
    if (!isActive) return;

    try {
      const lastUpdateId = lastUpdateIds.get(botToken) ?? 0;
      const response = await axios.get(
        `https://api.telegram.org/bot${botToken}/getUpdates?offset=${
          lastUpdateId + 1
        }&timeout=30&limit=100`,
        {
          timeout: 35000,
        }
      );

      retryCount = 0; 

      for (const update of response.data.result) {
        lastUpdateIds.set(botToken, update.update_id);

        if (update.message && isActive) {
          const messageChatId = update.message.chat.id.toString();
          const text = update.message.text;
          const replyToId = update.message.reply_to_message?.message_id;
            console.log("Received message:", replyToId, text);
          console.log("Received message:", messageChatId, text);

             const key = makeKey(chatId, targetMessageId);
            const excution =await prisma.excution.findUnique({
              where:{
                id: key,
              }
            }) as ActionResponse
            if(excution){
              const updateExction = await prisma.excution.update({
                where: {
                  id: key,
                },
                data: {
                  status: "SUCCESS",
                  metadata: {
                    telegramData: text
                  }
                }
              })
            }
            stopTelegramPolling(botToken);
            
            const workflow = await getWorkflow(excution.workflowId )
            const metadata = inputMetadat.get(key)
            sendWorkflowForProcess(workflow,metadata,excution.pointer as string,excution)
            return;
          }
        }
      
    }catch (err:any) {
      if (!isActive) return;
      
      console.error("Polling error:", err);
      if (err.response?.status === 409) {
        console.log(" 409 conflict - another instance is running. Stopping this poller.");
        stopTelegramPolling(botToken);
        return;
      }
      retryCount++;
      if (retryCount <= maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
        console.log(`🔄 Retrying in ${delay}ms... (attempt ${retryCount}/${maxRetries})`);
        setTimeout(() => {
          if (isActive) {
            poll();
          }
        }, delay);
        return;
      } else {
        console.log(" Max retries reached, stopping polling");
        stopTelegramPolling(botToken);
        return;
      }
    }
    if (isActive) {
      setTimeout(poll, 1000);
    }
  };
  const pollerControl = {
    stop: () => {
      isActive = false;
      console.log(`Stopping polling for bot ${botToken}`);
    },
    isActive: true
  };

  activePollers.set(botToken, pollerControl);
  
  poll();
};

export const stopTelegramPolling = (botToken: string) => {
  if (activePollers.has(botToken)) {
    const poller = activePollers.get(botToken)!;
    poller.stop();
    activePollers.delete(botToken);
    console.log(` Stopped polling for bot ${botToken}`);
  }
};


export const sendTelegramMessage = async (
  input: any,
  action:any
) => {
  const message = action.metadata.actionData.config.message
  const senderTokenId = action.metadata.actionData.config.botToken
  const parseMessage = replaceTokens(message, input);
  const parseSenderTokenId = replaceTokens(senderTokenId, input);

  try {
    await axios.post(
      `https://api.telegram.org/bot${parseSenderTokenId}/sendMessage`,
      {
        chat_id: `${input.chatId}`,
        text: `${parseMessage}`,
      }
    );
    console.log(" Telegram message sent!");
  } catch (err) {
    console.error(" Error sending message:", err);
  }
};

export const sendTelegramMessageAndWait = async (
  input: any,
  action:any,
  workflow: any
) => {
  const message = action.metadata.actionData.config.message
  const senderTokenId = action.metadata.actionData.config.botToken
  const parseMessage = replaceTokens(message, input);
  const parseSenderTokenId = replaceTokens(senderTokenId, input);

  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${parseSenderTokenId}/sendMessage`,
      {
        chat_id: `${input.chatId}`,
        text: `${parseMessage}`,
      }
    );

    const sentMessage = res.data.result;
    console.log(" Telegram message sent, waiting for reply...");

    const key = makeKey(input.chatId, sentMessage.message_id)
    inputMetadat.set(key,input)
    const getNextAction = getNextActionMetadata(workflow.actions,action.id)
    console.log(getNextAction,"this is get next action metadata")
     let nextActionId;
    if(getNextAction){
       nextActionId = getNextAction?.id
    }
    else{
      nextActionId="WORKFLOW_COMPLETED"
    }

    await prisma.excution.create({
      data:{
        id:key,
        workflowId: workflow.id,
        actionId: action.id,
        metadata: "sfasdfasdfsaa",
        pointer: nextActionId,
        status: "WAITING",
      }
    })
    await startTelegramPolling(parseSenderTokenId, sentMessage.message_id, input.chatId);
  } catch (err) {
    console.error(" Error sending message:", err);
    throw err;
  }
};

process.on('SIGINT', () => {
  console.log('🧹 Cleaning up pollers...');
  for (const [botToken] of activePollers) {
    stopTelegramPolling(botToken);
  }
  process.exit();
});