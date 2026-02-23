-- AlterTable: Add Telegram integration fields to Subscription
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "telegramChatId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "telegramVerifyCode" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "telegramVerifyExpires" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "telegramRemindersEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: Add API access fields to Subscription
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "apiToken" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "inboundEmailToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_telegramChatId_key" ON "Subscription"("telegramChatId");
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_apiToken_key" ON "Subscription"("apiToken");
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_inboundEmailToken_key" ON "Subscription"("inboundEmailToken");
