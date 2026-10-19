-- GotYoBack: progress table + row-level security.
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- Safe to re-run: uses "if not exists" throughout.

-- 1. Profile row per auth user (created automatically on sign-in, including guests).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  created_at timestamptz not null default now()
);

-- 2. One progress row per user. This is the gamification record.
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  xp integer not null default 0,
  lessons_completed text[] not null default '{}',
  projects_done text[] not null default '{}',
  missions_done text[] not null default '{}',
  experiments_run integer not null default 0,
  predictions_correct integer not null default 0,
  predictions_total integer not null default 0,
  achievements text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- 3. Auto-create a profile whenever a new auth user appears (guests included).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  insert into public.progress (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Row-level security: a user can only ever touch their own rows.
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own progress" on public.progress;
create policy "own progress" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
