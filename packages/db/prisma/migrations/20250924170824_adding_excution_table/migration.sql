-- CreateEnum
CREATE TYPE "public"."status" AS ENUM ('SUCCESS', 'FAILED', 'WAITING', 'RUNNING');

-- CreateTable
CREATE TABLE "public"."excution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "status" "public"."status" NOT NULL,

    CONSTRAINT "excution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."excution" ADD CONSTRAINT "excution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."excution" ADD CONSTRAINT "excution_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "public"."Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;
