/*
  Warnings:

  - You are about to drop the `subnodesTrigger` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."subnodesTrigger" DROP CONSTRAINT "subnodesTrigger_triggerId_fkey";

-- DropTable
DROP TABLE "public"."subnodesTrigger";

-- CreateTable
CREATE TABLE "public"."subnodesActions" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "subnodesActions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."subnodesActions" ADD CONSTRAINT "subnodesActions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "public"."Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;
