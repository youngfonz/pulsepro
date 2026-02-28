-- AlterTable: Add Telegram integration fields to Subscription
ALTER TABLE "Subscription" ADD COLUMN "telegramChatId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "telegramVerifyCode" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "telegramVerifyExpires" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN "telegramRemindersEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: Add API access fields to Subscription
ALTER TABLE "Subscription" ADD COLUMN "apiToken" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "inboundEmailToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_telegramChatId_key" ON "Subscription"("telegramChatId");
CREATE UNIQUE INDEX "Subscription_apiToken_key" ON "Subscription"("apiToken");
CREATE UNIQUE INDEX "Subscription_inboundEmailToken_key" ON "Subscription"("inboundEmailToken");
