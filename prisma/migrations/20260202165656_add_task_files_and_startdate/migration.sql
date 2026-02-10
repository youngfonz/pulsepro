-- AlterTable
ALTER TABLE "Task" ADD COLUMN "startDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "TaskFile" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskFile" ADD CONSTRAINT "TaskFile_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
