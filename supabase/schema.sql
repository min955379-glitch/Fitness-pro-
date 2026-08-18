create extension if not exists pgcrypto;

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
 facebook text, instagram text, tiktok text, youtube text,
 updated_at timestamptz not null default now()
);

create table if not exists public.trainers (
 id uuid primary key default gen_random_uuid(),
 name text not null, specialty text, bio text, image_url text, is_visible boolean not null default true,
 created_at timestamptz not null default now()
);

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

alter table public.membership_requests enable row level security;
alter table public.site_settings enable row level security;
alter table public.trainers enable row level security;

drop policy if exists "public can submit membership requests" on public.membership_requests;
create policy "public can submit membership requests" on public.membership_requests for insert to anon, authenticated with check (true);
drop policy if exists "admin can read membership requests" on public.membership_requests;
create policy "admin can read membership requests" on public.membership_requests for select to authenticated using ((auth.jwt() ->> 'email') = 'min955378@gmail.com');
drop policy if exists "admin can update membership requests" on public.membership_requests;
create policy "admin can update membership requests" on public.membership_requests for update to authenticated using ((auth.jwt() ->> 'email') = 'min955378@gmail.com') with check ((auth.jwt() ->> 'email') = 'min955378@gmail.com');

drop policy if exists "public can read site settings" on public.site_settings;
create policy "public can read site settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "admin can update site settings" on public.site_settings;
create policy "admin can update site settings" on public.site_settings for update to authenticated using ((auth.jwt() ->> 'email') = 'min955378@gmail.com') with check ((auth.jwt() ->> 'email') = 'min955378@gmail.com');

drop policy if exists "public can read visible trainers" on public.trainers;
create policy "public can read visible trainers" on public.trainers for select to anon, authenticated using (is_visible = true);
drop policy if exists "admin can manage trainers" on public.trainers;
create policy "admin can manage trainers" on public.trainers for all to authenticated using ((auth.jwt() ->> 'email') = 'min955378@gmail.com') with check ((auth.jwt() ->> 'email') = 'min955378@gmail.com');
