# Reference capability audit and Fitness Pro implementation

Audit date: 17 August 2026

This document records the functional capability map used to expand Fitness Pro. It intentionally excludes reference-site credentials, authentication tokens, private member records, messages and proprietary media.

## Public and member capabilities

| Audited capability | Fitness Pro implementation |
|---|---|
| Marketing home with training benefits, statistics and goals | `/` with database-driven settings and original Fitness Pro copy/art |
| About mission, vision, values, story and credentials | `/about`; editable in `/admin/settings` |
| Monthly Bronze, Silver and Gold plans | Home pricing section; `/admin/plans` CRUD |
| Diet-plan pricing | Home pricing section; `/admin/pricing` CRUD |
| Daily and weekly passes | Home pricing section; editable rates in `/admin/pricing` |
| 3-month, 6-month and 1-year pricing | Responsive duration table; editable in `/admin/pricing` |
| Database-driven trainers | `/trainers`; profile/photo/social management in `/admin/trainers` |
| Filterable gallery | `/gallery`; uploads and metadata in `/admin/gallery` |
| Contact details, hours, form and FAQ | `/contact`; inbox in `/admin/messages` |
| Member registration with optional plan | `/register` and Supabase Auth user trigger |
| Pending approval before attendance access | Member `approval_status`; `/admin/registrations` workflow |
| Login and password recovery | `/login`, `/forgot-password`, `/reset-password`, `/auth/callback` |
| Member portal | `/member` |
| Daily attendance | `/member/attendance` |
| Attendance history | `/member/attendance-history` |
| Attendance calendar and leave | `/member/calendar` |
| Member settings | `/member/settings` |
| Plan-aware payment page | `/payment` with membership, duration, diet and visit selections |
| EasyPaisa, JazzCash, bank and pay-at-gym choices | Payment-request workflow with explicit manual-verification status |

## Administrative capabilities

| Audited section | Fitness Pro implementation |
|---|---|
| Dashboard | `/admin/dashboard`: member, registration, message, attendance and payment metrics |
| Messages | `/admin/messages`: status filters, internal notes and deletion |
| Members | `/admin/members`: search; membership/approval filters; create/edit/remove/delete |
| Member detail and attendance | `/admin/members/[id]` and `/admin/members/[id]/attendance` |
| Plans | `/admin/plans` plus create/edit routes |
| Pricing | `/admin/pricing` plus diet create/edit routes |
| Registrations | `/admin/registrations`: pending/approved/rejected and linked/unlinked filters |
| Attendance | `/admin/attendance`: selectable date, member search, present/absent actions |
| Attendance history | `/admin/attendance-history`: ranges, inactivity summary, leave review and logs |
| Trainers | `/admin/trainers` plus create/edit routes and image uploads |
| Gallery | `/admin/gallery`: image, category, caption, order and visibility |
| Payments | `/admin/payments`: pending/verified/rejected review |
| Activity | `/admin/activity`: registered/login success/login failure/logout filters |
| Settings | `/admin/settings`: identity, contact, hours, social, hero, statistics, footer and About copy |

## Authorization and data design

- Public forms have narrow insert-only RLS policies.
- Public marketing tables expose active rows only.
- Member rows, attendance, leave and payments are restricted to the authenticated owner.
- Member profile changes use a narrow `update_my_profile` database function.
- Admin pages and every admin server action call `requireAdmin()`.
- Database policies independently verify `is_admin()`.
- The existing Fitness Pro owner email remains authorized while `admin_users` provides role storage.
- Images upload to a public-read, admin-write `fitness-pro-media` bucket with MIME and 4 MB limits.
- No service-role key is required by the app.

## Originality and branding

The implementation reproduces capabilities, not third-party expression. It uses:

- Fitness Pro branding and business details
- Original page structure and copy
- A distinct black/yellow design system
- Four original generated facility images stored in `public/images`
- No copied reference images, member records, messages or protected assets

## Activation

Application source and database structure deploy separately. Run `supabase/schema.sql` in the Fitness Pro Supabase SQL Editor before enabling the expanded member and admin workflows in production.
