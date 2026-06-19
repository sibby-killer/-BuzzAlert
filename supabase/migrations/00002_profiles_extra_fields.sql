-- Add extra profile fields
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists reddit_username text,
  add column if not exists location text;
