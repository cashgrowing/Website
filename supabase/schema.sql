-- WildRoots enquiries.
--
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- Safe to run more than once.
--
-- Design note: the browser never talks to Supabase at all. Submissions go to
-- our own route handler, which writes with the service role key from the
-- server. The brief suggested letting the anon key insert; not exposing any
-- Supabase key to the browser is strictly stronger, so RLS below grants
-- nothing to anon or authenticated. The service role bypasses RLS by design.

create extension if not exists "pgcrypto";

create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Which funnel this came from.
  kind          text not null check (kind in ('owner', 'guest')),

  name          text not null,
  email         text not null,
  phone         text,
  message       text,

  -- Owner enquiries: where the house is. Guest enquiries: dates and party size.
  property_location text,
  stay_details      text,

  -- Context, for working out which page actually converts.
  source_path   text,
  -- Truncated user agent. Never store a raw IP: hashed only, see below.
  user_agent    text,
  -- SHA-256 of the client IP plus a server-side salt. Enough to spot abuse,
  -- not enough to identify a person or to be worth stealing.
  ip_hash       text,

  -- Set once the lead reaches ClickUp, so a failed hand-off can be retried
  -- rather than silently lost.
  clickup_task_id text,
  handled_at      timestamptz
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_kind_idx       on public.inquiries (kind);

-- Row level security on, and deliberately no policies: anon and authenticated
-- can neither read nor write. Only the service role, used server-side, can
-- touch this table.
alter table public.inquiries enable row level security;

revoke all on public.inquiries from anon, authenticated;

comment on table public.inquiries is
  'Owner and guest enquiries. Written only by the site''s server route handler using the service role key. No browser-facing access.';
