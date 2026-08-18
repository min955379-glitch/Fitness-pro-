# Fitness Pro

Production website and membership-request dashboard for Fitness Pro, Abbottabad.

**Live site:** https://fitness-pro-kappa.vercel.app

## Stack

- Next.js 16
- React 19
- TypeScript
- Supabase Auth, Postgres, and Row Level Security
- Vercel

## Features

- Responsive gym landing page
- Membership and diet-plan pricing
- Membership request form backed by Supabase
- Admin authentication
- Admin dashboard and membership-request list
- Supabase Row Level Security policies

## Local setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Set these browser-safe Supabase values in `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
   ```

4. Run `supabase/schema.sql` in the Supabase SQL Editor.

5. In Supabase Authentication, create and confirm the admin user whose email is authorized in `supabase/schema.sql`.

6. Start the development server:

   ```bash
   npm run dev
   ```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

## Deployment

The production Vercel project is named `fitness-pro`. Configure these variables for Production and Preview:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Both values are intended for browser use. Never expose or commit a Supabase service-role key.

Merges and pushes to the connected production branch can be deployed automatically after the GitHub repository is linked in Vercel.

## Business details

- **Name:** Fitness Pro
- **Email:** min955378@gmail.com
- **Phone/WhatsApp:** 0348 5581969
- **Address:** 5752+WRX, Orish Colony Rd, Nawan Shehr Town, Abbottabad, Pakistan
- **Monday–Friday:** 6:00 AM–10:00 AM and 3:00 PM–11:30 PM
- **Saturday–Sunday:** Closed

## Security

- Membership requests can be inserted anonymously but cannot be read anonymously.
- Admin reads and updates are restricted by Supabase RLS.
- `.env*` files are ignored except `.env.example`.
- Add rate limiting and bot protection before running paid advertising or high-volume campaigns.
