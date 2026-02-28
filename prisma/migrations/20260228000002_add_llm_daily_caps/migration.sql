-- Add daily call tracking to CachedInsight for LLM rate limiting
ALTER TABLE "CachedInsight" ADD COLUMN "dailyCalls" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CachedInsight" ADD COLUMN "dailyCallsDate" TEXT;
