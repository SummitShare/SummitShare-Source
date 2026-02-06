# Mock Auth Setup - Development Mode

## Overview
The app has been configured to run without a database connection using mocked authentication. This allows development and testing of the public exhibit pages without requiring PostgreSQL.

## What Was Changed

### 1. NextAuth Route Mocked
**File**: `src/app/api/auth/[...nextauth]/route.ts`

- Removed database dependency (passwordCompare imports)
- Returns a mock user for any login attempt
- No Prisma queries executed during authentication
- Mock user has ID: `mock-user-id-123`

### 2. Environment Configuration
**File**: `.env` (created)

```env
NEXTAUTH_SECRET=dev-secret-key-for-mock-auth-do-not-use-in-production
DATABASE_URL="file:./dev.db"
```

### 3. Already Configured (No Changes Needed)
- **Ticket Validation Disabled**: `ENABLE_VALIDATION = false` in `ticketService.ts`
- **Exhibit Pages Open**: No authentication required to view exhibits
- **Access Validation Disabled**: Commented out in exhibit pages

## Dev Server Status

✅ **Running on**: http://localhost:3001
✅ **Home Page**: Accessible and rendering
✅ **Exhibit Pages**: Free and open (no purchase/auth required)
✅ **TypeScript**: Compiles without errors
✅ **Prisma Client**: Generated successfully

## Current Warnings (Non-Critical)

1. **pino-pretty**: Optional dependency missing (WalletConnect logger)
   - Does not affect functionality
   - Can be ignored for development

2. **HackMD Blog**: API fetch fails (no HACKMD_API_TOKEN)
   - Blog section won't load on home page
   - Add token to `.env` if blog is needed

## What Works Without Database

✅ Home page rendering
✅ Exhibit gallery page
✅ Individual artifact pages
✅ Video playback
✅ Navigation
✅ Public content viewing
✅ Mock login (any credentials work)

## What Doesn't Work Without Database

❌ Real user signup
❌ Real user authentication
❌ User profile management
❌ Wallet address storage
❌ Ticket purchase tracking (already disabled)
❌ Proposal/voting system
❌ Stakeholder management

## Development Workflow

```bash
# Start dev server
cd packages/dapp
pnpm dev

# Access app
# http://localhost:3001

# Test login (if needed)
# Email: any@email.com
# Password: anything
```

## Restoring Database Functionality

When ready to restore full functionality:

1. Set up PostgreSQL instance (local or hosted)
2. Update `DATABASE_URL` in `.env`
3. Run migrations: `pnpm prisma migrate deploy`
4. Restore the NextAuth route to use real passwordCompare
5. Enable ticket validation if needed

## Notes

- The app is designed for **open/free viewing** model
- Exhibits are publicly accessible without purchase
- Auth is only needed for user accounts, not viewing
- This mock setup is perfect for testing public pages
