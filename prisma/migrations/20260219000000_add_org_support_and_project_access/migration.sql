-- AlterTable: Add orgId to Client
ALTER TABLE "Client" ADD COLUMN "orgId" TEXT;

-- AlterTable: Add orgId to Project
ALTER TABLE "Project" ADD COLUMN "orgId" TEXT;

-- AlterTable: Add orgId to Task
ALTER TABLE "Task" ADD COLUMN "orgId" TEXT;

-- AlterTable: Add orgId to Subscription
ALTER TABLE "Subscription" ADD COLUMN "orgId" TEXT;

-- CreateTable: ProjectAccess
CREATE TABLE "ProjectAccess" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "grantedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Client_orgId_idx" ON "Client"("orgId");

CREATE INDEX "Project_orgId_idx" ON "Project"("orgId");
CREATE INDEX "Project_orgId_status_idx" ON "Project"("orgId", "status");
CREATE INDEX "Project_orgId_dueDate_idx" ON "Project"("orgId", "dueDate");

CREATE INDEX "Task_orgId_idx" ON "Task"("orgId");
CREATE INDEX "Task_orgId_completed_idx" ON "Task"("orgId", "completed");
CREATE INDEX "Task_orgId_dueDate_idx" ON "Task"("orgId", "dueDate");

CREATE UNIQUE INDEX "ProjectAccess_projectId_userId_key" ON "ProjectAccess"("projectId", "userId");
CREATE INDEX "ProjectAccess_userId_idx" ON "ProjectAccess"("userId");
CREATE INDEX "ProjectAccess_projectId_idx" ON "ProjectAccess"("projectId");

CREATE INDEX "Subscription_orgId_idx" ON "Subscription"("orgId");

-- AddForeignKey
ALTER TABLE "ProjectAccess" ADD CONSTRAINT "ProjectAccess_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
