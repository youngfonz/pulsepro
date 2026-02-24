#!/bin/bash
# One-command local dev setup for PulsePro
# Usage: npm run dev:setup

set -e

echo "Setting up local dev environment..."

# Check for Vercel CLI
if ! command -v npx &> /dev/null; then
  echo "Error: npx not found. Install Node.js first."
  exit 1
fi

# Pull production env vars (includes Clerk keys, DB, etc.)
echo "Pulling production env vars from Vercel..."
npx vercel env pull .env.local --environment production --yes 2>/dev/null

# Ensure ADMIN_USER_IDS is set (production might not have it in the pull)
if ! grep -q "ADMIN_USER_IDS" .env.local 2>/dev/null; then
  echo "" >> .env.local
  echo "ADMIN_USER_IDS=\"user_39gDkEXlWy6U3vOmaWdymHZn2uI\"" >> .env.local
  echo "Added ADMIN_USER_IDS"
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate --no-hints 2>/dev/null

echo ""
echo "Done! Run 'npm run dev' to start the server."
echo "Open http://localhost:3000"
