## API documentation

## Overview

This app uses Next.js App Router API routes. The active API surface is versioned under `/api/v1`, with the exception of NextAuth, which remains under `/api/auth`.

## Active Routes

- `/api/auth/*` for NextAuth handlers.
- `/api/v1/*` for application APIs.
- `/api/v1/events/*` for airdrops, event creation, deployment, and tickets.
- `/api/v1/user/*` for wallets, verification, password flows, deletion, tickets, and usernames.
- `/api/v1/signup` for account creation.

Legacy non‑v1 API routes were removed during cleanup to avoid duplicate behavior.
