import axios from "axios";
import {Resend} from "resend";


export const sendMail = async (resendApi:string,senderEmailId: string,recieverEmailId: string, subject: string, body: string) => {
  console.log("Sending email...");
  const resend = new Resend(`re_Ca4mZiFb_38tehj1AJzV27FCQkbfj3FL5`);
  console.log(resendApi,senderEmailId,recieverEmailId,subject,body)
  await resend.emails.send({
    from: `${senderEmailId}`,
    to: `${recieverEmailId}`,
    subject: `${subject}`,  
    text: `${body}`,
  })
};


export const sendTelegramMessage = async (chatId: string,senderTokenId: string, message: string) => {
  console.log("Sending message...");
  console.log(chatId,senderTokenId,message)
    try {
    await axios.post(`https://api.telegram.org/bot${ senderTokenId }/sendMessage`, {
      chat_id: `${chatId}`,
      text: `${message}`,
    });
    console.log("Message sent!");
  } catch (err) {
    console.error("Error sending message:", err);
  }
  
};