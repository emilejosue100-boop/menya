-- Menya public-read schema. Run this in the Supabase SQL editor, then run seed.sql.

create table if not exists public.cancers (
  slug text primary key,
  name text not null,
  summary text not null,
  signs text[] not null default '{}',
  prevention text[] not null default '{}',
  icon text not null,
  review_note text
);

create table if not exists public.myths (
  id text primary key,
  cancer text not null,
  myth text not null,
  why_people_believe text not null,
  fact text not null,
  what_to_do text not null,
  source text,
  age_level text not null,
  audio_url text,
  review_note text
);

create table if not exists public.quiz_questions (
  id text primary key,
  cancer text not null,
  question text not null,
  choices text[] not null default '{}',
  answer integer not null,
  review_note text
);

create table if not exists public.survivors (
  id text primary key,
  name text not null,
  cancer text not null,
  language text[] not null default '{}',
  country text not null,
  city text not null,
  story text not null,
  voice_url text,
  is_demo boolean not null default true,
  review_note text
);

create table if not exists public.support_groups (
  id text primary key,
  name text not null,
  cancer text not null,
  language text not null,
  city text not null,
  country text not null,
  whatsapp_link text,
  lat double precision not null,
  lng double precision not null,
  moderator text,
  review_note text
);

create table if not exists public.organisations (
  id text primary key,
  name text not null,
  offers text[] not null default '{}',
  who_qualifies text not null,
  how_to_apply text not null,
  country text not null,
  city text not null,
  lat double precision not null,
  lng double precision not null,
  website text,
  verified boolean not null default true,
  review_note text
);

alter table public.cancers enable row level security;
alter table public.myths enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.survivors enable row level security;
alter table public.support_groups enable row level security;
alter table public.organisations enable row level security;

drop policy if exists "Public read cancers" on public.cancers;
drop policy if exists "Public read myths" on public.myths;
drop policy if exists "Public read quiz_questions" on public.quiz_questions;
drop policy if exists "Public read survivors" on public.survivors;
drop policy if exists "Public read support_groups" on public.support_groups;
drop policy if exists "Public read organisations" on public.organisations;

create policy "Public read cancers" on public.cancers for select using (true);
create policy "Public read myths" on public.myths for select using (true);
create policy "Public read quiz_questions" on public.quiz_questions for select using (true);
create policy "Public read survivors" on public.survivors for select using (true);
create policy "Public read support_groups" on public.support_groups for select using (true);
create policy "Public read organisations" on public.organisations for select using (true);

grant usage on schema public to anon, authenticated;
grant select on table public.cancers, public.myths, public.quiz_questions, public.survivors, public.support_groups, public.organisations to anon, authenticated;
