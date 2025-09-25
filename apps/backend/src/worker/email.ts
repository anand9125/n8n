import { Resend } from "resend"
import { Router, Request, Response } from 'express';
const router = Router();
import {PrismaClient} from "@prisma/client";
import { sendWorkflowForProcess } from "./processWorkflow";
const prisma = new PrismaClient();
const inputMetadat:Map<string,any> = new Map();
import { IncomingEmail } from "../types/type";
import { getWorkflow } from "./getWorkflow";

const replaceTokens = (template: string, data: Record<string, any>) => {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const value = data[key.trim()];
    return value !== undefined ? String(value) : "";
  });
};


export const sendMail = async (
  action:any,
  input: any
) => {
  try {
    const resendApi = action.metadata.actionData.config.resendApi
    const senderEmailId = action.metadata.actionData.config.fromEmail
    const subject = action.metadata.actionData.config.subject
    const body =  action.metadata.actionData.config.body
    const parsedBody = replaceTokens(body, input);
    const parsedSubject = replaceTokens(subject, input);
    const parseResendApi = replaceTokens(resendApi, input);
    const parseSenderEmailId = replaceTokens(senderEmailId, input);

    const resend = new Resend(`${parseResendApi}`);

    console.log(
      "[sendMail] Sending email with:",
      { from: parseSenderEmailId, to: input.emailId, subject: parsedSubject }
    );

    const response = await resend.emails.send({
      from: parseSenderEmailId,
      to: input.emailId,
      subject: parsedSubject,
      html: parsedBody,
    });

    console.log("[sendMail] Response:", response);
  } catch (err) {
    console.error("[sendMail] Error:", err);
  }
};


export const sendMailTOWaitAndReply = async (
  resendApi: string,
  senderEmailId: string,
  excutionId: string,
  input: any,
  subject: string,
  body: string
) => {
  try {
    const parsedBody = replaceTokens(body, input);
    const parsedSubject = replaceTokens(subject, input);
    const parseResendApi = replaceTokens(resendApi, input);
    const parseSenderEmailId = replaceTokens(senderEmailId, input);
    const resend = new Resend(`${parseResendApi}`);
    const response = await resend.emails.send({
      from: parseSenderEmailId,
      to: input.emailId,
      replyTo:`${excutionId}@reply.coursehubb.store`,
      subject: parsedSubject,
      html: parsedBody,
    });
  } catch (err) {
    console.error("[sendMail] Error:", err);
  }
};
export const getNextActionMetadata = (actions: any[], actionId: string) => {
  const sortedActions = [...actions].sort((a, b) => a.sortingOrder - b.sortingOrder);
  const currentIndex = sortedActions.findIndex((a) => a.id === actionId);
  if (currentIndex === -1) return null; // not found
  if (currentIndex === sortedActions.length - 1) return null;
  return sortedActions[currentIndex + 1];
};


export const sendMailAndWait = async ( workflow: any,action:any,input: any) => {
     try{
        const resendApi= action.metadata.actionData.config.resendApi
        const senderEmailId = action.metadata.actionData.config.fromEmail
        const workflowId= workflow.id //TODO :change this to workflowId and action id
        const subject = action.metadata.actionData.config.subject
        const body =  action.metadata.actionData.config.body
        const getNextAction = getNextActionMetadata(workflow.actions,action.id)
        const nextActionId = getNextAction?.id
        const excution = await prisma.excution.create({
          data:{
            workflowId: workflowId,
            actionId: action.id,
            metadata: "sfasdfasdfsaa",
            pointer: nextActionId,
            status: "WAITING",
          }
        })
        await sendMailTOWaitAndReply(resendApi, senderEmailId,excution.id, input, subject, body);
        inputMetadat.set(excution.id,input)
        return excution;
     }catch (err) {
         console.error("[sendMailAndWait] Error:", err);
     }
 };


router.post("/email/inbound", async(req: Request, res: Response) => {
    // TODO: Handle inbound email
    const emailPayload = req.body;
    const mainEmail:IncomingEmail= {
      fromName: emailPayload.FromName,
      fromEmail: emailPayload.From, // main sender email
      to: emailPayload.To, // main recipient
      subject: emailPayload.Subject,
      messageId: emailPayload.MessageID,
      date: emailPayload.Date,
      textBody: emailPayload.TextBody,
      htmlBody: emailPayload.HtmlBody,
      strippedTextReply: emailPayload.StrippedTextReply,
      attachments: emailPayload.Attachments || [],
    };
    const excutionId = mainEmail.to.split("@")[0] as string
    const excution = await prisma.excution.findUnique({
        where: {
            id: excutionId,
        },
    })
    if(!excution){
      res.status(404).send  ({
        message: "Email not found",
      })  
      return
    }
    await prisma.excution.update({
        where: {
            id: excutionId,
        },
        data: {
            status: "SUCCESS",
            metadata: {
                mainEmail: mainEmail
            }
        }
    })
    const workflow = await getWorkflow(excution.workflowId) 
    const metadata = inputMetadat.get(excutionId)
    if(!workflow){
      return
    }
    sendWorkflowForProcess(workflow,metadata,excution.pointer as string,excution)  
    res.status(200).send  ({
        message: "Email received",
    })  
})


export const postmarkRouter = router;
