-- Fitness Pro database schema and idempotent expansion migration.
-- Run this file in the Supabase SQL Editor as the project owner.

create extension if not exists pgcrypto;

-- Existing lead form retained for backwards compatibility.
create table if not exists public.membership_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  plan text,
  status text not null default 'new' check (status in ('new','contacted','approved','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id boolean primary key default true,
  gym_name text not null default 'Fitness Pro',
  email text not null default 'min955378@gmail.com',
  phone text not null default '03485581969',
  address text not null default '5752+WRX, Orish Colony Rd, Nawan Shehr Town, Abbottabad, Pakistan',
  weekday_hours text not null default '6:00 AM - 10:00 AM and 3:00 PM - 11:30 PM',
  weekend_hours text not null default 'Closed',
  facebook text,
  instagram text,
  tiktok text,
  youtube text,
  updated_at timestamptz not null default now()
);
alter table public.site_settings add column if not exists city text not null default 'Abbottabad';
alter table public.site_settings add column if not exists whatsapp text not null default '923485581969';
alter table public.site_settings add column if not exists hero_kicker text not null default 'ABBOTTABAD''S STRENGTH COMMUNITY';
alter table public.site_settings add column if not exists hero_title text not null default 'TRAIN STRONG. LIVE STRONGER.';
alter table public.site_settings add column if not exists hero_copy text not null default 'Purposeful training, modern equipment and a team that knows your name.';
alter table public.site_settings add column if not exists active_members_label text not null default '500+';
alter table public.site_settings add column if not exists trainers_label text not null default '10+';
alter table public.site_settings add column if not exists years_label text not null default '5+';
alter table public.site_settings add column if not exists story_title text not null default 'Built for consistent progress';
alter table public.site_settings add column if not exists story_body text not null default 'Fitness Pro is a focused training space for Abbottabad. We combine quality equipment, practical coaching and a respectful community so every member can train with confidence.';
alter table public.site_settings add column if not exists mission text not null default 'Make structured, high-quality fitness accessible to our local community.';
alter table public.site_settings add column if not exists vision text not null default 'Build Abbottabad''s most trusted strength and wellness community.';
alter table public.site_settings add column if not exists values_copy text not null default 'Discipline, respect, progress and honest coaching guide everything we do.';
alter table public.site_settings add column if not exists founder_name text not null default 'Fitness Pro Team';
alter table public.site_settings add column if not exists founder_note text not null default 'Local coaches committed to helping members build lasting habits.';
alter table public.site_settings add column if not exists certifications text not null default 'Qualified coaching • Safe training practices • Member-first support';
alter table public.site_settings add column if not exists footer_copy text not null default 'Train with purpose. Progress with confidence.';

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Preserve the existing owner account as an administrator when it exists.
insert into public.admin_users (user_id, email)
select id, lower(email) from auth.users where lower(email) = 'min955378@gmail.com'
on conflict (user_id) do update set email = excluded.email;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
set row_security = off
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = 'min955378@gmail.com'
    or exists (select 1 from public.admin_users a where a.user_id = auth.uid()),
    false
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price numeric(12,2),
  billing_period text not null default 'Monthly' check (billing_period in ('Monthly','Quarterly','Yearly')),
  tagline text,
  features text[] not null default '{}',
  is_popular boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diet_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price numeric(12,2),
  was_price numeric(12,2),
  blurb text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pricing_rates (
  key text primary key,
  label text not null,
  amount numeric(12,2) not null default 0,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.duration_prices (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  months integer not null,
  bronze_price numeric(12,2) not null,
  silver_price numeric(12,2) not null,
  gold_price numeric(12,2) not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  email text,
  phone text not null,
  plan_id uuid references public.membership_plans(id) on delete set null,
  join_date date,
  expiry_date date,
  custom_duration_months integer,
  admission_fee_paid boolean not null default false,
  notes text,
  membership_status text not null default 'active' check (membership_status in ('active','expired','removed')),
  approval_status text not null default 'pending' check (approval_status in ('pending','approved','rejected')),
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists members_auth_user_idx on public.members(auth_user_id);
create index if not exists members_approval_idx on public.members(approval_status);
create index if not exists members_membership_idx on public.members(membership_status);

-- Backfill any existing non-admin Auth accounts created before this migration.
insert into public.members (auth_user_id, full_name, email, phone, approval_status, membership_status)
select
  u.id,
  coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'),''), split_part(coalesce(u.email,''),'@',1), 'Member'),
  u.email,
  coalesce(nullif(trim(u.raw_user_meta_data ->> 'phone'),''), 'Not provided'),
  'pending',
  'active'
from auth.users u
left join public.admin_users a on a.user_id = u.id
where a.user_id is null
on conflict (auth_user_id) do nothing;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new','contacted','resolved','cancelled','archived')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contact_messages_status_idx on public.contact_messages(status, created_at desc);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  attendance_date date not null default current_date,
  status text not null default 'present' check (status in ('present','absent','leave')),
  check_in_at timestamptz,
  note text,
  marked_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(member_id, attendance_date)
);
create index if not exists attendance_date_idx on public.attendance(attendance_date desc);
create index if not exists attendance_member_idx on public.attendance(member_id, attendance_date desc);

create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  from_date date not null,
  to_date date not null,
  note text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (to_date >= from_date)
);

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  selection_type text not null check (selection_type in ('membership','duration','diet','visit')),
  selection_name text not null,
  amount numeric(12,2),
  method text not null check (method in ('easypaisa','jazzcash','bank','gym')),
  reference text,
  note text,
  status text not null default 'pending' check (status in ('pending','verified','rejected','cancelled')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);
create index if not exists payment_requests_status_idx on public.payment_requests(status, submitted_at desc);

create table if not exists public.activity_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  member_id uuid references public.members(id) on delete set null,
  email text,
  event_type text not null check (event_type in ('registered','login_success','login_failed','logout')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists activity_events_created_idx on public.activity_events(created_at desc);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Expand the existing trainer model without discarding current data.
create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text,
  bio text,
  image_url text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.trainers add column if not exists slug text;
alter table public.trainers add column if not exists certifications text[] not null default '{}';
alter table public.trainers add column if not exists experience_years integer not null default 0;
alter table public.trainers add column if not exists sort_order integer not null default 0;
alter table public.trainers add column if not exists instagram text;
alter table public.trainers add column if not exists facebook text;
alter table public.trainers add column if not exists youtube text;
alter table public.trainers add column if not exists tiktok text;
alter table public.trainers add column if not exists is_featured boolean not null default false;
alter table public.trainers add column if not exists updated_at timestamptz not null default now();
create unique index if not exists trainers_slug_unique on public.trainers(slug) where slug is not null;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null unique,
  category text not null default 'Gym Floor',
  caption text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed original Fitness Pro pricing and generated local gallery art.
insert into public.membership_plans (slug,name,price,billing_period,tagline,features,is_popular,is_active,sort_order) values
  ('bronze','Bronze',1500,'Monthly','A focused start','{"Gym access","Cross training","Workout guidance"}',false,true,10),
  ('silver','Silver',2000,'Monthly','More structure, more support','{"Full gym access","Cross training","Workout plan","Basic coaching"}',true,true,20),
  ('gold','Gold',6500,'Monthly','Complete coaching support','{"Full gym access","Diet plan","Workout plan","Cross training","Personal training"}',false,true,30)
on conflict (slug) do nothing;

insert into public.diet_plans (slug,name,price,was_price,blurb,is_active,sort_order) values
  ('basic','Basic',500,null,'A practical starter nutrition guide for better daily choices.',true,10),
  ('premium','Premium',3000,null,'Personalized nutrition support aligned with your training goal.',true,20)
on conflict (slug) do nothing;

insert into public.pricing_rates (key,label,amount,sort_order) values
  ('daily_without_training','Daily • Gym access',200,10),
  ('daily_with_training','Daily • With training',300,20),
  ('weekly_without_training','Weekly • Gym access',600,30),
  ('weekly_with_training','Weekly • With training',700,40)
on conflict (key) do nothing;

insert into public.duration_prices (label,months,bronze_price,silver_price,gold_price,sort_order) values
  ('3 Months',3,4000,5000,18500,10),
  ('6 Months',6,8000,10000,35000,20),
  ('1 Year',12,15000,20000,70000,30)
on conflict (label) do nothing;

insert into public.gallery_items (image_url,category,caption,sort_order,is_active) values
  ('/images/fitness-pro-floor.jpg','Gym Floor','A training floor built for focused work.',10,true),
  ('/images/fitness-pro-strength.jpg','Strength','Quality strength equipment for progressive training.',20,true),
  ('/images/fitness-pro-cardio.jpg','Cardio','Conditioning equipment for every pace.',30,true),
  ('/images/fitness-pro-hero.jpg','Facility','Purposeful design, serious training.',40,true)
on conflict (image_url) do nothing;

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

do $$
declare t text;
begin
  foreach t in array array['site_settings','membership_plans','diet_plans','pricing_rates','duration_prices','members','contact_messages','attendance','leave_requests','trainers','gallery_items'] loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', t, t);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

create or replace function public.handle_fitness_pro_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  chosen_plan uuid;
  member_record uuid;
begin
  begin
    chosen_plan := nullif(new.raw_user_meta_data ->> 'plan_id','')::uuid;
  exception when others then
    chosen_plan := null;
  end;
  insert into public.members (auth_user_id, full_name, email, phone, plan_id, approval_status, membership_status)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'),''), split_part(coalesce(new.email,''),'@',1), 'New member'),
    new.email,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'phone'),''), 'Not provided'),
    chosen_plan,
    'pending',
    'active'
  )
  on conflict (auth_user_id) do update set email = excluded.email
  returning id into member_record;
  insert into public.activity_events(user_id, member_id, email, event_type)
  values(new.id, member_record, new.email, 'registered');
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_fitness_pro on auth.users;
create trigger on_auth_user_created_fitness_pro
after insert on auth.users for each row execute function public.handle_fitness_pro_user();

create or replace function public.update_my_profile(p_full_name text, p_phone text)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  update public.members
     set full_name = left(trim(p_full_name),120), phone = left(trim(p_phone),40)
   where auth_user_id = auth.uid();
end;
$$;
revoke all on function public.update_my_profile(text,text) from public;
grant execute on function public.update_my_profile(text,text) to authenticated;

create or replace function public.log_auth_event(p_event text, p_email text default null)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare mid uuid;
begin
  if p_event not in ('login_success','login_failed','logout') then raise exception 'Unsupported event'; end if;
  if p_event <> 'login_failed' and auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_event = 'login_failed' then
    if length(coalesce(p_email,'')) > 254 then return; end if;
    if exists(select 1 from public.activity_events where event_type='login_failed' and lower(email)=lower(p_email) and created_at > now()-interval '5 minutes') then return; end if;
  else
    select id into mid from public.members where auth_user_id=auth.uid() limit 1;
  end if;
  insert into public.activity_events(user_id,member_id,email,event_type)
  values(auth.uid(),mid,coalesce((auth.jwt()->>'email'),p_email),p_event);
end;
$$;
revoke all on function public.log_auth_event(text,text) from public;
grant execute on function public.log_auth_event(text,text) to anon, authenticated;

-- Row Level Security
alter table public.membership_requests enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users enable row level security;
alter table public.membership_plans enable row level security;
alter table public.diet_plans enable row level security;
alter table public.pricing_rates enable row level security;
alter table public.duration_prices enable row level security;
alter table public.members enable row level security;
alter table public.contact_messages enable row level security;
alter table public.attendance enable row level security;
alter table public.leave_requests enable row level security;
alter table public.payment_requests enable row level security;
alter table public.activity_events enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.trainers enable row level security;
alter table public.gallery_items enable row level security;

-- Helper for idempotent policy replacement.
drop policy if exists "public can submit membership requests" on public.membership_requests;
create policy "public can submit membership requests" on public.membership_requests for insert to anon, authenticated with check (true);
drop policy if exists "admin can manage membership requests" on public.membership_requests;
create policy "admin can manage membership requests" on public.membership_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- Remove names used by the original schema before creating consolidated policies.
drop policy if exists "admin can read membership requests" on public.membership_requests;
drop policy if exists "admin can update membership requests" on public.membership_requests;

drop policy if exists "public can read site settings" on public.site_settings;
create policy "public can read site settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "admin can update site settings" on public.site_settings;
create policy "admin can update site settings" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin can read admin users" on public.admin_users;
create policy "admin can read admin users" on public.admin_users for select to authenticated using (public.is_admin());

do $$
begin
  -- Policies below are recreated explicitly so repeated migrations remain safe.
end $$;

drop policy if exists "public can read active plans" on public.membership_plans;
create policy "public can read active plans" on public.membership_plans for select to anon, authenticated using (is_active or public.is_admin());
drop policy if exists "admin can manage plans" on public.membership_plans;
create policy "admin can manage plans" on public.membership_plans for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can read active diet plans" on public.diet_plans;
create policy "public can read active diet plans" on public.diet_plans for select to anon, authenticated using (is_active or public.is_admin());
drop policy if exists "admin can manage diet plans" on public.diet_plans;
create policy "admin can manage diet plans" on public.diet_plans for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can read pricing rates" on public.pricing_rates;
create policy "public can read pricing rates" on public.pricing_rates for select to anon, authenticated using (true);
drop policy if exists "admin can manage pricing rates" on public.pricing_rates;
create policy "admin can manage pricing rates" on public.pricing_rates for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can read duration prices" on public.duration_prices;
create policy "public can read duration prices" on public.duration_prices for select to anon, authenticated using (is_active or public.is_admin());
drop policy if exists "admin can manage duration prices" on public.duration_prices;
create policy "admin can manage duration prices" on public.duration_prices for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "member can read own profile" on public.members;
create policy "member can read own profile" on public.members for select to authenticated using (auth_user_id = auth.uid() or public.is_admin());
drop policy if exists "admin can manage members" on public.members;
create policy "admin can manage members" on public.members for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can send contact messages" on public.contact_messages;
create policy "public can send contact messages" on public.contact_messages for insert to anon, authenticated with check (status = 'new');
drop policy if exists "admin can manage contact messages" on public.contact_messages;
create policy "admin can manage contact messages" on public.contact_messages for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "member can read own attendance" on public.attendance;
create policy "member can read own attendance" on public.attendance for select to authenticated using (exists(select 1 from public.members m where m.id=member_id and m.auth_user_id=auth.uid()) or public.is_admin());
drop policy if exists "admin can manage attendance" on public.attendance;
create policy "admin can manage attendance" on public.attendance for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "member can read own leave" on public.leave_requests;
create policy "member can read own leave" on public.leave_requests for select to authenticated using (exists(select 1 from public.members m where m.id=member_id and m.auth_user_id=auth.uid()) or public.is_admin());
drop policy if exists "member can request leave" on public.leave_requests;
create policy "member can request leave" on public.leave_requests for insert to authenticated with check (status='pending' and exists(select 1 from public.members m where m.id=member_id and m.auth_user_id=auth.uid()));
drop policy if exists "member can cancel leave" on public.leave_requests;
create policy "member can cancel leave" on public.leave_requests for update to authenticated using (status='pending' and exists(select 1 from public.members m where m.id=member_id and m.auth_user_id=auth.uid())) with check (status='cancelled' and exists(select 1 from public.members m where m.id=member_id and m.auth_user_id=auth.uid()));
drop policy if exists "admin can manage leave" on public.leave_requests;
create policy "admin can manage leave" on public.leave_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "member can read own payments" on public.payment_requests;
create policy "member can read own payments" on public.payment_requests for select to authenticated using (exists(select 1 from public.members m where m.id=member_id and m.auth_user_id=auth.uid()) or public.is_admin());
drop policy if exists "member can submit payments" on public.payment_requests;
create policy "member can submit payments" on public.payment_requests for insert to authenticated with check (status='pending' and exists(select 1 from public.members m where m.id=member_id and m.auth_user_id=auth.uid()));
drop policy if exists "admin can manage payments" on public.payment_requests;
create policy "admin can manage payments" on public.payment_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "member can add own activity" on public.activity_events;
create policy "member can add own activity" on public.activity_events for insert to authenticated with check (user_id=auth.uid() and event_type in ('login_success','logout'));
drop policy if exists "admin can read activity" on public.activity_events;
create policy "admin can read activity" on public.activity_events for select to authenticated using (public.is_admin());

drop policy if exists "public can subscribe" on public.newsletter_subscribers;
create policy "public can subscribe" on public.newsletter_subscribers for insert to anon, authenticated with check (is_active=true);
drop policy if exists "admin can manage subscribers" on public.newsletter_subscribers;
create policy "admin can manage subscribers" on public.newsletter_subscribers for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can read visible trainers" on public.trainers;
create policy "public can read visible trainers" on public.trainers for select to anon, authenticated using (is_visible or public.is_admin());
drop policy if exists "admin can manage trainers" on public.trainers;
create policy "admin can manage trainers" on public.trainers for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can read gallery" on public.gallery_items;
create policy "public can read gallery" on public.gallery_items for select to anon, authenticated using (is_active or public.is_admin());
drop policy if exists "admin can manage gallery" on public.gallery_items;
create policy "admin can manage gallery" on public.gallery_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public media bucket for trainer and gallery uploads.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('fitness-pro-media','fitness-pro-media',true,4194304,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=4194304,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "public can view fitness pro media" on storage.objects;
create policy "public can view fitness pro media" on storage.objects for select to public using (bucket_id='fitness-pro-media');
drop policy if exists "admin can upload fitness pro media" on storage.objects;
create policy "admin can upload fitness pro media" on storage.objects for insert to authenticated with check (bucket_id='fitness-pro-media' and public.is_admin());
drop policy if exists "admin can update fitness pro media" on storage.objects;
create policy "admin can update fitness pro media" on storage.objects for update to authenticated using (bucket_id='fitness-pro-media' and public.is_admin()) with check (bucket_id='fitness-pro-media' and public.is_admin());
drop policy if exists "admin can delete fitness pro media" on storage.objects;
create policy "admin can delete fitness pro media" on storage.objects for delete to authenticated using (bucket_id='fitness-pro-media' and public.is_admin());
