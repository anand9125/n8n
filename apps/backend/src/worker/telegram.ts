import axios from "axios";

// Registry maps
const pendingResponses: Map<string, (value: any) => void> = new Map();  //Holds pending promises waiting for replies
const activePollers: Map<string, { stop: () => void; isActive: boolean }> = new Map();  //Tracks running pollers per bot token.
const lastUpdateIds: Map<string, number> = new Map();

// --- Helpers ---
const replaceTokens = (template: string, data: Record<string, any>) => {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const value = data[key.trim()];
    return value !== undefined ? String(value) : "";
  });
};

const makeKey = (chatId: string, messageId: number) =>
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

// --- Core Polling (Only for specific message responses) ---
const startTelegramPolling = async (botToken: string, targetMessageId: number, chatId: string) => {
  // Stop any existing poller for this bot
  if (activePollers.has(botToken)) {
    const existingPoller = activePollers.get(botToken)!;
    existingPoller.stop();
    activePollers.delete(botToken);
  }

  // Clear webhook first to prevent 409 conflicts
  await clearWebhook(botToken);
  
  // Wait longer for webhook to be cleared and any other instances to stop
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log(`🔄 Starting targeted polling for bot ${botToken} - waiting for reply to message ${targetMessageId}`);

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

      retryCount = 0; // Reset retry count on successful request

      for (const update of response.data.result) {
        lastUpdateIds.set(botToken, update.update_id);

        if (update.message && isActive) {
          const messageChatId = update.message.chat.id.toString();
          const text = update.message.text;
          const replyToId = update.message.reply_to_message?.message_id;

          console.log("📩 Received message:", messageChatId, text);

          // Only process if it's a reply to our target message and from the correct chat
          if (replyToId === targetMessageId && messageChatId === chatId) {
            const key = makeKey(chatId, targetMessageId);
            const resolver = pendingResponses.get(key);

            if (resolver) {
              console.log("✅ Found matching reply! Stopping polling and resolving...");
              resolver(text);
              pendingResponses.delete(key);
              
              // Stop polling immediately after getting the response
              stopTelegramPolling(botToken);
              return;
            }
          }
        }
      }
    } catch (err:any) {
      if (!isActive) return;
      
      console.error("Polling error:", err);
      
      // If we get a 409 conflict, stop polling entirely
      if (err.response?.status === 409) {
        console.log("🛑 409 conflict - another instance is running. Stopping this poller.");
        stopTelegramPolling(botToken);
        return;
      }

      // For other errors, implement exponential backoff
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
        console.log("❌ Max retries reached, stopping polling");
        stopTelegramPolling(botToken);
        return;
      }
    }

    // Schedule next poll only if still active
    if (isActive) {
      setTimeout(poll, 1000);
    }
  };

  // Create poller control object
  const pollerControl = {
    stop: () => {
      isActive = false;
      console.log(`🛑 Stopping polling for bot ${botToken}`);
    },
    isActive: true
  };

  activePollers.set(botToken, pollerControl);
  
  // Start polling
  poll();
};

// Cleanup function
export const stopTelegramPolling = (botToken: string) => {
  if (activePollers.has(botToken)) {
    const poller = activePollers.get(botToken)!;
    poller.stop();
    activePollers.delete(botToken);
    console.log(`🛑 Stopped polling for bot ${botToken}`);
  }
};

// --- Public Functions ---
export const sendTelegramMessage = async (
  input: any,
  senderTokenId: string,
  message: string
) => {
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
    console.log("✅ Telegram message sent!");
  } catch (err) {
    console.error("❌ Error sending message:", err);
  }
};

export const sendTelegramMessageAndWait = async (
  input: any,
  senderTokenId: string,
  message: string
) => {
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
    console.log("✅ Telegram message sent, waiting for reply...");

    // Start targeted polling for this specific message and chat
    await startTelegramPolling(parseSenderTokenId, sentMessage.message_id, input.chatId);

    return new Promise((resolve, reject) => {
      const key = makeKey(input.chatId, sentMessage.message_id);

      pendingResponses.set(key, (response) => {
        console.log("🎉 Response received:", response);
        resolve(response);
      });

      setTimeout(() => {
        if (pendingResponses.has(key)) {
          pendingResponses.delete(key);
          stopTelegramPolling(parseSenderTokenId); // Stop polling on timeout
          reject(new Error("⏳ Timeout: No Telegram reply"));
        }
      }, 120000); // 2 min
    });
  } catch (err) {
    console.error("❌ Error sending message:", err);
    throw err;
  }
};

// Cleanup on process exit
process.on('SIGINT', () => {
  console.log('🧹 Cleaning up pollers...');
  for (const [botToken] of activePollers) {
    stopTelegramPolling(botToken);
  }
  process.exit();
});