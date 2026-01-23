import prisma from "@repo/db/lib"   

export const getWorkflow = async (workflowId: string) => {
    const workflow = await prisma.workflow.findFirst({
              where: {
                  id: workflowId,
              },
              include: {
                  actions: {
                      include: {
                          type: true,      
                          subnodes: true,  
                      },
                  },
                  trigger: {
                      include: {
                          type: true,     
                      },
                  },
                  edges: true,        
              },
          });
    if(!workflow) {
      throw new Error("Workflow not found");
    }
    return workflow;
  }

  
