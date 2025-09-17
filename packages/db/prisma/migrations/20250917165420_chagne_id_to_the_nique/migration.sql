/*
  Warnings:

  - The primary key for the `subnodesActions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[actionId]` on the table `subnodesActions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."subnodesActions" DROP CONSTRAINT "subnodesActions_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "subnodesActions_actionId_key" ON "public"."subnodesActions"("actionId");
