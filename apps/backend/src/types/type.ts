import z from "zod";
export const JWT_SECRET  = "user_secret";
export const JWT_SEC = "admin_secret";

export const workflowSchema = z.object({
    workflowId: z.string(),
    avaialbleTriggersId: z.string(),
    triggerMetadata:z.any().optional(),
    triggerPositionX:z.number(),
    triggerPositionY:z.number(),
    userId: z.string(),
    actions: z.array(z.object({  //this refer arrays of actions objects
        availableActionId: z.string(),
        actionMetadata: z.any().optional(),
        positionX:z.number(),
        positionY:z.number()
    }))
})

import { Prisma, status } from "@prisma/client";

export type ActionResponse = {
  id: string;
  workflowId: string;
  actionId: string;
  metadata: Prisma.JsonValue; // matches your `Json` column
  status: status;             // enum from Prisma
  pointer: string | null;
}
;


export type IncomingEmail = {
  fromName: string;
  fromEmail: string;
  to: string;
  subject: string;
  messageId: string;
  date: string;
  textBody: string;
  htmlBody: string;
  strippedTextReply: string;
  attachments: Array<any>; // or a more detailed type if needed
};
