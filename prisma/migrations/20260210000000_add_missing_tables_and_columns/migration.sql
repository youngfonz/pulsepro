-- CreateTable: Subscription (required before org_support migration can ALTER it)
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "polarCustomerId" TEXT,
    "polarSubscriptionId" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_polarCustomerId_idx" ON "Subscription"("polarCustomerId");
CREATE INDEX "Subscription_polarSubscriptionId_idx" ON "Subscription"("polarSubscriptionId");

-- CreateTable: TimeEntry
CREATE TABLE "TimeEntry" (
    "id" TEXT NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: TaskComment
CREATE TABLE "TaskComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskComment_taskId_idx" ON "TaskComment"("taskId");

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Add userId to Client
ALTER TABLE "Client" ADD COLUMN "userId" TEXT;

-- CreateIndex
CREATE INDEX "Client_userId_idx" ON "Client"("userId");

-- AlterTable: Add missing columns to Project
ALTER TABLE "Project" ADD COLUMN "userId" TEXT;
ALTER TABLE "Project" ADD COLUMN "notes" TEXT;
ALTER TABLE "Project" ADD COLUMN "hourlyRate" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");
CREATE INDEX "Project_userId_status_idx" ON "Project"("userId", "status");
CREATE INDEX "Project_userId_dueDate_idx" ON "Project"("userId", "dueDate");
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");

-- AlterTable: Add missing columns to Task
ALTER TABLE "Task" ADD COLUMN "userId" TEXT;
ALTER TABLE "Task" ADD COLUMN "notes" TEXT;
ALTER TABLE "Task" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'todo';
ALTER TABLE "Task" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Task" ADD COLUMN "url" TEXT;
ALTER TABLE "Task" ADD COLUMN "bookmarkType" TEXT;
ALTER TABLE "Task" ADD COLUMN "thumbnailUrl" TEXT;
ALTER TABLE "Task" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");
CREATE INDEX "Task_userId_completed_idx" ON "Task"("userId", "completed");
CREATE INDEX "Task_userId_dueDate_idx" ON "Task"("userId", "dueDate");
CREATE INDEX "Task_userId_projectId_idx" ON "Task"("userId", "projectId");
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex: Missing indexes from earlier migrations
CREATE INDEX "TaskImage_taskId_idx" ON "TaskImage"("taskId");
CREATE INDEX "TaskFile_taskId_idx" ON "TaskFile"("taskId");
