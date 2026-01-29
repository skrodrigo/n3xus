-- CreateTable
CREATE TABLE "public"."user_usage" (
    "userId" TEXT NOT NULL,
    "dayCount" INTEGER NOT NULL DEFAULT 0,
    "dayWindowStart" TIMESTAMP(3) NOT NULL,
    "weekCount" INTEGER NOT NULL DEFAULT 0,
    "weekWindowStart" TIMESTAMP(3) NOT NULL,
    "monthCount" INTEGER NOT NULL DEFAULT 0,
    "monthWindowStart" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_usage_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "public"."user_usage" ADD CONSTRAINT "user_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
