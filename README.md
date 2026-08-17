# Fitness Pro Full-Stack Website

Production-ready Next.js + Supabase starter for Fitness Pro, Abbottabad. The visual direction follows the supplied Town Fitness Point reference while using Fitness Pro branding and the pricing from the supplied poster.

## Business details
- Name: Fitness Pro
- Email: min955378@gmail.com
- Phone/WhatsApp: 03485581969
- Address: 5752+WRX, Orish Colony Rd, Nawan Shehr Town, Abbottabad, Pakistan
- Monday-Friday: 6:00 AM-10:00 AM and 3:00 PM-11:30 PM
- Saturday-Sunday: Closed
- Trainers: initially blank
- Social links: initially blank

## Pricing from poster
- Bronze: Rs. 1,500
- Silver: Rs. 2,000
- Gold: Rs. 6,500
- Basic Diet: Rs. 500
- Premium Diet: Rs. 3,000
- Daily: Rs. 200 without training / Rs. 300 with training
- Weekly: Rs. 600 without training / Rs. 700 with training
- 3 months: Bronze 4,000 / Silver 5,000 / Gold 18,500
- 6 months: Bronze 8,000 / Silver 10,000 / Gold 35,000
- 1 year: Bronze 15,000 / Silver 20,000 / Gold 70,000

## Local setup
1. Run `supabase/schema.sql` in the Supabase SQL Editor.
2. Create the admin user in Supabase Authentication with email `min955378@gmail.com` and a strong password.
3. Copy `.env.example` to `.env.local`.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Run `npm install`, then `npm run dev`.

## Vercel
Import the `fitness-pro` folder as a Next.js project. Add the same two public Supabase environment variables in Vercel. Do NOT add a Supabase service-role/secret key to client-side variables.

## Security
The schema restricts admin reads/updates to the Supabase Auth email `min955378@gmail.com`. The public site can submit membership requests. Keep service-role/secret keys server-side only.

## Included assets
- `public/fitness-pro-logo.svg`
- `public/pricing-poster.jpg`

## Deployment status
This package is prepared for deployment. No new Fitness Pro production URL is claimed here because the available Vercel deployment action did not accept the local project payload in this session.
