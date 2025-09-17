-- Step 1: Add columns as nullable
ALTER TABLE "public"."Action" ADD COLUMN "positionX" DOUBLE PRECISION;
ALTER TABLE "public"."Action" ADD COLUMN "positionY" DOUBLE PRECISION;

ALTER TABLE "public"."Trigger" ADD COLUMN "positionX" DOUBLE PRECISION;
ALTER TABLE "public"."Trigger" ADD COLUMN "positionY" DOUBLE PRECISION;

-- Step 2: Populate existing rows with default values
UPDATE "public"."Action" SET "positionX" = 0, "positionY" = 0 WHERE "positionX" IS NULL OR "positionY" IS NULL;
UPDATE "public"."Trigger" SET "positionX" = 0, "positionY" = 0 WHERE "positionX" IS NULL OR "positionY" IS NULL;

-- Step 3: Make columns NOT NULL
ALTER TABLE "public"."Action" ALTER COLUMN "positionX" SET NOT NULL;
ALTER TABLE "public"."Action" ALTER COLUMN "positionY" SET NOT NULL;

ALTER TABLE "public"."Trigger" ALTER COLUMN "positionX" SET NOT NULL;
ALTER TABLE "public"."Trigger" ALTER COLUMN "positionY" SET NOT NULL;
