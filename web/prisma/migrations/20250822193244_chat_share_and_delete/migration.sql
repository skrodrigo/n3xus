/*
  Warnings:

  - A unique constraint covering the columns `[sharePath]` on the table `chats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."chats" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharePath" TEXT;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "public"."subscription" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" TEXT,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN,
    "seats" INTEGER,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chats_sharePath_key" ON "public"."chats"("sharePath");

-- CreateIndex
CREATE INDEX "chats_userId_idx" ON "public"."chats"("userId");
