-- AlterTable: Make projectId optional on Task (was NOT NULL from init migration)
ALTER TABLE "Task" ALTER COLUMN "projectId" DROP NOT NULL;
