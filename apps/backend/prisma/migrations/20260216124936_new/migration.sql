/*
  Warnings:

  - The primary key for the `Credentials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `credentials` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `triggerId` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the `Action` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AvailableAction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AvailableTriggers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Edge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExecutionLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trigger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowRun` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowRunOutbox` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `excution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subnodesActions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[webhookId]` on the table `Workflow` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data` to the `Credentials` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `platform` on the `Credentials` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `triggerType` to the `Workflow` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `Workflow` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('TELEGRAM', 'RESEND_EMAIL', 'GEMINI', 'GROQ');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('MANUAL', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'PAUSED', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_availableActionId_fkey";

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "Edge" DROP CONSTRAINT "Edge_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "ExecutionLog" DROP CONSTRAINT "ExecutionLog_WorkflowRunId_fkey";

-- DropForeignKey
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_availableTriggersId_fkey";

-- DropForeignKey
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowRun" DROP CONSTRAINT "WorkflowRun_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowRunOutbox" DROP CONSTRAINT "WorkflowRunOutbox_WorkflowRunId_fkey";

-- DropForeignKey
ALTER TABLE "excution" DROP CONSTRAINT "excution_actionId_fkey";

-- DropForeignKey
ALTER TABLE "excution" DROP CONSTRAINT "excution_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "subnodesActions" DROP CONSTRAINT "subnodesActions_actionId_fkey";

-- AlterTable
ALTER TABLE "Credentials" DROP CONSTRAINT "Credentials_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "credentials",
DROP COLUMN "description",
DROP COLUMN "updatedAt",
ADD COLUMN     "data" JSONB NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "platform",
ADD COLUMN     "platform" "Platform" NOT NULL,
ADD CONSTRAINT "Credentials_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Credentials_id_seq";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "name",
ADD COLUMN     "lastLoggedIn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "createdAt",
DROP COLUMN "status",
DROP COLUMN "triggerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "connections" JSONB,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nodesJson" JSONB,
ADD COLUMN     "triggerType" "TriggerType" NOT NULL,
ADD COLUMN     "webhookId" TEXT,
ALTER COLUMN "title" SET NOT NULL;

-- DropTable
DROP TABLE "Action";

-- DropTable
DROP TABLE "AvailableAction";

-- DropTable
DROP TABLE "AvailableTriggers";

-- DropTable
DROP TABLE "Edge";

-- DropTable
DROP TABLE "ExecutionLog";

-- DropTable
DROP TABLE "Trigger";

-- DropTable
DROP TABLE "WorkflowRun";

-- DropTable
DROP TABLE "WorkflowRunOutbox";

-- DropTable
DROP TABLE "excution";

-- DropTable
DROP TABLE "subnodesActions";

-- DropEnum
DROP TYPE "status";

-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "secret" TEXT,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Execution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "tasksDone" INTEGER NOT NULL DEFAULT 0,
    "totalTasks" INTEGER,
    "result" JSONB,
    "pausedNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "fields" JSONB NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_webhookId_key" ON "Workflow"("webhookId");

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
