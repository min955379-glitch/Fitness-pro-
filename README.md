# Fitness Pro

Full marketing, membership, attendance and gym-management platform for Fitness Pro in Abbottabad.

**Production:** https://fitness-pro-kappa.vercel.app  
**Admin login:** https://fitness-pro-kappa.vercel.app/admin/login

## Platform capabilities

### Public website

- Responsive home page with memberships, diet support, visit passes and duration pricing
- Original Fitness Pro facility imagery generated for this project
- About, Trainers, Gallery and Contact pages
- Category-filterable gallery
- Database-driven trainer profiles and social links
- Contact form and newsletter subscriptions
- Mobile navigation, accessible forms and responsive tables

### Accounts and member portal

- Supabase email registration and login
- Password recovery and secure reset callback
- Optional plan selection during registration
- Pending, approved and rejected registration workflow
- Membership overview and approval status
- Daily attendance status and 30/90-day/all-time history
- Monthly attendance calendar and planned-leave requests
- Member profile and theme settings
- Payment requests for memberships, duration plans, diet plans and visit passes
- EasyPaisa, JazzCash, bank-transfer and pay-at-gym request methods
- Manual staff verification notice—no payment is represented as complete before review

### Admin portal

- Dashboard metrics and operational shortcuts
- Contact-message statuses, internal notes and deletion
- Searchable member directory with membership and approval filters
- Member creation, editing, removal, permanent deletion and attendance detail
- Registration approval/rejection and account-link status
- Date-based attendance roster with present/absent controls
- Attendance history, 14-day inactivity summary and leave approvals
- Membership-plan CRUD
- Diet plans, daily/weekly rates and duration-pricing management
- Trainer profiles, credentials, social links, photos, visibility and display order
- Gallery image uploads, categories, captions, visibility and display order
- Payment verification/rejection
- Registration/login/logout activity trail
- Business, contact, hours, social, statistics, footer and About-page settings

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Supabase Auth, Postgres, Storage and Row Level Security
- Vercel
- `lucide-react` icons

No service-role key is used by the application. Browser and server clients use only the Supabase publishable/anon key, with authorization enforced by database Row Level Security.

## Local setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Add the browser-safe Supabase values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
   ```

4. Run [`supabase/schema.sql`](supabase/schema.sql) once in the Supabase SQL Editor. The migration is idempotent and expands the earlier Fitness Pro schema without deleting its existing membership requests, settings or trainers.

5. Confirm that the owner account exists in Supabase Auth. The schema recognizes `min955378@gmail.com` as the existing owner and also creates an `admin_users` table for role-based authorization.

6. Start the app:

   ```bash
   npm run dev
   ```

## Database activation

The expanded source and expanded database schema are separate deployment steps:

1. Open the Fitness Pro project in Supabase.
2. Open **SQL Editor → New query**.
3. Paste the complete contents of `supabase/schema.sql` and run it.
4. Confirm that the query completes without errors.
5. Test registration, admin approval, attendance and payment-request verification.

The migration creates/expands:

- `admin_users`
- `members`
- `membership_plans`
- `diet_plans`
- `pricing_rates`
- `duration_prices`
- `contact_messages`
- `attendance`
- `leave_requests`
- `payment_requests`
- `activity_events`
- `newsletter_subscribers`
- `trainers`
- `gallery_items`
- the public `fitness-pro-media` Storage bucket

It also installs user-registration/profile functions, event logging, timestamps, indexes and restrictive RLS policies.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

The production build intentionally uses Webpack via `next build --webpack`.

## Security model

- Public users can read only active marketing content and submit limited public forms.
- Members can read only their own member, attendance, leave and payment records.
- Members update profile fields through a narrow database function rather than broad row updates.
- Administrators are checked in both the application and Supabase RLS policies.
- Admin mutations are server actions and still remain subject to RLS.
- Gallery and trainer uploads accept JPG, PNG or WebP files up to 4 MB.
- No service-role/secret key, database password or personal access token belongs in this repository.
- Failed-login event insertion is rate-limited per email inside the database function; production bot protection is still recommended for high-volume advertising.

## Business details

- **Fitness Pro**
- **Phone/WhatsApp:** 0348 5581969
- **Email:** min955378@gmail.com
- **Address:** 5752+WRX, Orish Colony Rd, Nawan Shehr Town, Abbottabad, Pakistan
- **Monday–Friday:** 6:00 AM–10:00 AM and 3:00 PM–11:30 PM
- **Saturday–Sunday:** Closed
