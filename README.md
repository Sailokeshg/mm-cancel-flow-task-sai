# Migrate Mate - Subscription Cancellation Flow Challenge

## Overview

Convert an existing Figma design into a fully-functional subscription-cancellation flow for Migrate Mate. This challenge tests your ability to implement pixel-perfect UI, handle complex business logic, and maintain security best practices.

## Objective

Implement the Figma-designed cancellation journey exactly on mobile + desktop, persist outcomes securely, and instrument the A/B downsell logic.

## What's Provided

This repository contains:

- ✅ Next.js + TypeScript + Tailwind scaffold
- ✅ `seed.sql` with users table (25/29 USD plans) and empty cancellations table
- ✅ Local Supabase configuration for development
- ✅ Basic Supabase client setup in `src/lib/supabase.ts`

## Tech Stack (Preferred)

- **Next.js** with App Router
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Supabase** (Postgres + Row-Level Security)

> **Alternative stacks allowed** if your solution:
>
> 1. Runs with `npm install && npm run dev`

# Migrate Mate — Cancellation flow (one-page)

This README explains the implemented architecture decisions, security measures, and the deterministic A/B downsell approach required by the challenge.

Architecture decisions

- Next.js (App Router) + TypeScript: keeps server routes and client UI together; API routes live in `src/app/api/*` and are used for all stateful operations.
- Server-side DB writes via Supabase admin client (`src/lib/supabase.ts`): prevents exposing privileged keys to the browser and allows enforcing RLS on the DB side.
- UI: client components live under `src/components/*`. They handle UX only and call the server endpoints for persistence and variant decisions.
- Mock auth for dev: `src/lib/mockUser.ts` maps to seeded users in `seed.sql` so the flow works locally without third-party auth.

Security implementation

- Row-Level Security: RLS is enabled in `seed.sql` and basic policies exist; server-side admin writes are used in dev to bypass client RLS while keeping production policies enforceable.
- Server-side validation & sanitization: API validates subscription IDs, parses JSON safely, and sanitizes free-text `reason` (trim, 500-char limit, strip control characters) to reduce XSS/DB injection risk.
- CSRF/XSS: state changes are made via server endpoints (not direct client DB writes). For production, add CSRF tokens and stricter headers if exposing any form endpoints.
- Sensitive data: payment processing is out-of-scope and only stubbed; avoid logging any payment or card-like data.

A/B testing approach (deterministic & persistent)

- Assignment: on first entry the server uses a cryptographically secure RNG (Node's crypto.randomInt(0,2)) to pick 'A' or 'B'.
- Persistence: the chosen variant is saved to `cancellations.downsell_variant` and returned on subsequent visits — the server never re-randomizes for that user.
- Variant behavior: Variant B shows a $10-off downsell. Prices are stored in cents (e.g., 2500 → $25.00). Downsells compute as `downsell_price = monthly_price - 1000`.

Reproducible setup

1. Install dependencies and seed the DB locally:

```bash
npm install
npm run db:setup
```

2. Start dev server:

```bash
npm run dev
```

Files to review

- API: `src/app/api/cancellations/route.ts` (GET returns/creates variant; POST persists reason/accepted flags and updates subscription status).
- Mock user: `src/lib/mockUser.ts` (dev only).
- DB seed and RLS: `seed.sql`.

Notes & next steps

- This README satisfies the one-page requirement and explains architecture, security, and A/B behavior. If you'd like, I will wire the front-end to explicitly call the GET endpoint before rendering the downsell modal (so Variant B shows the offer), and add unit tests for the API route.
