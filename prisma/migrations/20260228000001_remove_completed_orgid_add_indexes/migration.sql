-- Migrate completed boolean data into status field before dropping
UPDATE "Task" SET "status" = 'done' WHERE "completed" = true AND "status" != 'done';

-- Drop the completed column from Task
ALTER TABLE "Task" DROP COLUMN "completed";

-- Drop orgId columns
ALTER TABLE "Client" DROP COLUMN IF EXISTS "orgId";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "orgId";
ALTER TABLE "Task" DROP COLUMN IF EXISTS "orgId";
ALTER TABLE "Subscription" DROP COLUMN IF EXISTS "orgId";

-- Make userId required (non-nullable) on Client, Project, Task
-- First ensure no nulls exist
UPDATE "Client" SET "userId" = 'orphan' WHERE "userId" IS NULL;
UPDATE "Project" SET "userId" = 'orphan' WHERE "userId" IS NULL;
UPDATE "Task" SET "userId" = 'orphan' WHERE "userId" IS NULL;

ALTER TABLE "Client" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Task" ALTER COLUMN "userId" SET NOT NULL;

-- Drop old orgId indexes
DROP INDEX IF EXISTS "Client_orgId_idx";
DROP INDEX IF EXISTS "Project_orgId_idx";
DROP INDEX IF EXISTS "Project_orgId_status_idx";
DROP INDEX IF EXISTS "Project_orgId_dueDate_idx";
DROP INDEX IF EXISTS "Task_orgId_idx";
DROP INDEX IF EXISTS "Task_orgId_status_idx";
DROP INDEX IF EXISTS "Task_orgId_dueDate_idx";
DROP INDEX IF EXISTS "Task_orgId_completed_idx";
DROP INDEX IF EXISTS "Subscription_orgId_idx";

-- Drop old completed index and create status index
DROP INDEX IF EXISTS "Task_userId_completed_idx";
CREATE INDEX "Task_userId_status_idx" ON "Task"("userId", "status");

-- Add new composite indexes for common query patterns
CREATE INDEX "Task_userId_status_dueDate_idx" ON "Task"("userId", "status", "dueDate");
CREATE INDEX "Task_projectId_url_idx" ON "Task"("projectId", "url");
CREATE INDEX "Project_userId_status_dueDate_idx" ON "Project"("userId", "status", "dueDate");
CREATE INDEX "Project_userId_updatedAt_idx" ON "Project"("userId", "updatedAt");
CREATE INDEX "Invoice_userId_status_idx" ON "Invoice"("userId", "status");
CREATE INDEX "Invoice_userId_createdAt_idx" ON "Invoice"("userId", "createdAt");
CREATE INDEX "TimeEntry_projectId_idx" ON "TimeEntry"("projectId");
