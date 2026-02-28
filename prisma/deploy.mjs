/**
 * Production database deployment script.
 *
 * Uses `prisma db push` instead of `prisma migrate deploy` because the
 * migration history became inconsistent (a migration was inserted before
 * already-applied ones, which Prisma refuses to run). `db push` compares the
 * current schema.prisma to the live database and applies only the necessary
 * DDL changes.
 *
 * Before pushing the schema we run a one-time data migration to move
 * `completed` boolean values into the `status` column so no data is lost
 * when the column is dropped.
 */

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function run() {
  try {
    // One-time data migration: completed → status
    // Safe to run multiple times — only updates rows that still have the column
    try {
      await prisma.$executeRawUnsafe(
        `UPDATE "Task" SET "status" = 'done' WHERE "completed" = true AND "status" != 'done'`
      )
      console.log('[deploy] Migrated completed → status')
    } catch {
      // Column already dropped — nothing to do
      console.log('[deploy] completed column already gone, skipping data migration')
    }
  } finally {
    await prisma.$disconnect()
  }

  // Push schema changes to the database
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
  console.log('[deploy] Schema pushed successfully')
}

run().catch((err) => {
  console.error('[deploy] Failed:', err)
  process.exit(1)
})
