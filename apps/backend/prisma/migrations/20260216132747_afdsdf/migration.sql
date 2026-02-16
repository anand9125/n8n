/*
  Warnings:

  - A unique constraint covering the columns `[workflowId,nodeId]` on the table `Form` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Form_workflowId_nodeId_key" ON "Form"("workflowId", "nodeId");
