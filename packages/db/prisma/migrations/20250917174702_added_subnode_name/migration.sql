/*
  Warnings:

  - Added the required column `subnodeName` to the `subnodesActions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."subnodesActions" ADD COLUMN     "subnodeName" TEXT NOT NULL,
ADD CONSTRAINT "subnodesActions_pkey" PRIMARY KEY ("id");
