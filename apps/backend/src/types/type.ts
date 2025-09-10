import z from "zod";


export const workflowSchema = z.object({
    avaialbleTriggersId: z.string(),
    triggerMetadata:z.any().optional(),
    userId: z.string(),
    actions: z.array(z.object({  //this refer arrays of actions objects
        availableActionId: z.string(),
        actionMetadata: z.any().optional()
    }))
})