-- CreateTable
CREATE TABLE "public"."subnodesTrigger" (
    "id" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "subnodesTrigger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."subnodesTrigger" ADD CONSTRAINT "subnodesTrigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "public"."Trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;
