-- CreateTable
CREATE TABLE "CachedInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "insights" TEXT NOT NULL,
    "context" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CachedInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CachedInsight_userId_key" ON "CachedInsight"("userId");

-- CreateIndex
CREATE INDEX "CachedInsight_userId_expiresAt_idx" ON "CachedInsight"("userId", "expiresAt");
