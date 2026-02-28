#!/bin/bash
# One-command local dev setup for PulsePro
# Usage: npm run dev:setup

set -e

echo "Setting up local dev environment..."
echo ""

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

# Print summary
ADMIN_ID=$(grep ADMIN_USER_IDS .env.local 2>/dev/null | cut -d'"' -f2)
CLERK_KEY=$(grep NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY .env.local 2>/dev/null | cut -d'"' -f2 | head -c 10)

echo ""
echo "============================================"
echo "  PulsePro Local Dev — Ready"
echo "============================================"
echo ""
echo "  Server:    http://localhost:3000"
echo "  Admin ID:  ${ADMIN_ID:-not set}"
echo "  Clerk:     ${CLERK_KEY}..."
echo ""
echo "  Run: npm run dev"
echo ""
echo "============================================"
echo ""
echo "  ADMIN SETUP"
echo "  Your Clerk user ID must match ADMIN_USER_IDS"
echo "  in .env.local to get super admin access."
echo ""
echo "  To find your Clerk user ID:"
echo "  1. Sign in at http://localhost:3000"
echo "  2. Go to https://dashboard.clerk.com → Users"
echo "  3. Click your user → copy the ID"
echo "  4. Update ADMIN_USER_IDS in .env.local"
echo "  5. Restart dev server"
echo ""
echo "  Super admin powers:"
echo "  • Auto Team plan (highest tier)"
echo "  • /admin panel — manage all users"
echo "  • Change any user's plan"
echo "  • Suspend, wipe, or delete users"
echo "  • Maintenance mode kill switch"
echo "============================================"
