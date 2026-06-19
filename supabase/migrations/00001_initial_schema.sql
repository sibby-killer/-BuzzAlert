-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro')),
  paystack_customer_code text,
  created_at timestamptz not null default now()
);

-- Create keywords table
create table if not exists public.keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  keyword text not null,
  created_at timestamptz not null default now()
);

-- Create mentions table
create table if not exists public.mentions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  keyword_id uuid not null references public.keywords(id) on delete cascade,
  reddit_id text not null,
  title text not null,
  body text,
  url text not null,
  subreddit text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

-- Create unique index on reddit_id to prevent duplicate mentions
create unique index if not exists idx_mentions_reddit_id on public.mentions(reddit_id);

-- Create index for faster queries
create index if not exists idx_keywords_user_id on public.keywords(user_id);
create index if not exists idx_mentions_user_id on public.mentions(user_id);
create index if not exists idx_mentions_keyword_id on public.mentions(keyword_id);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.keywords enable row level security;
alter table public.mentions enable row level security;

-- Profiles RLS
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Keywords RLS
create policy "Users can insert own keywords"
  on public.keywords for insert
  with check (auth.uid() = user_id);

create policy "Users can read own keywords"
  on public.keywords for select
  using (auth.uid() = user_id);

create policy "Users can update own keywords"
  on public.keywords for update
  using (auth.uid() = user_id);

create policy "Users can delete own keywords"
  on public.keywords for delete
  using (auth.uid() = user_id);

-- Mentions RLS
create policy "Users can read own mentions"
  on public.mentions for select
  using (auth.uid() = user_id);

create policy "Users can update own mentions"
  on public.mentions for update
  using (auth.uid() = user_id);

-- Function and trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
