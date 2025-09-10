import z from "zod";
export const JWT_SECRET  = "user_secret";
export const JWT_SEC = "admin_secret";

export const workflowSchema = z.object({
    avaialbleTriggersId: z.string(),
    triggerMetadata:z.any().optional(),
    userId: z.string(),
    actions: z.array(z.object({  //this refer arrays of actions objects
        availableActionId: z.string(),
        actionMetadata: z.any().optional()
    }))
})