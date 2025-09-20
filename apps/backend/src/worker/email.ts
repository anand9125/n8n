import axios from "axios";
import {Resend} from "resend";
const pendingResponses: Map<string, (value: any) => void> = new Map();

const replaceTokens = (template: string, data: Record<string, any>) => {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const value = data[key.trim()];
    return value !== undefined ? String(value) : "";
  });
};
//input: form submission data (e.g. { name: "Anand", email: "test@example.com" })
//subject: may contain tokens (e.g. "Welcome {{name}}")
//body: may contain tokens (e.g. "Hello {{name}}, your email is {{email}}")
export const sendMail = async (resendApi:string,senderEmailId: string,input: any, subject: string, body: string) => {
    try{
        const parsedBody = replaceTokens(body, input);
        const parsedSubject = replaceTokens(subject, input);
        const parseResendApi = replaceTokens(resendApi, input);
        const parseSenderEmailId = replaceTokens(senderEmailId, input);
        const resend = new Resend(parseResendApi);
        await resend.emails.send({
          from: `${parseSenderEmailId}`,
          to: `${input.emailId}`,
          subject: `${parsedSubject}`,  
          text: `${parsedBody}`,
        })
    }catch(err){
        console.log(err)
    }
}
export const sendMailAndWait = async (resendApi:string,senderEmailId: string,input: any, subject: string, body: string) => {
    try{
        await sendMail(resendApi,senderEmailId,input,subject,body)

    }catch(err){
        console.log(err)
    }
}