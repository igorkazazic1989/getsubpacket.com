-- SubPacket schema. Run once in the Supabase SQL editor.
create extension if not exists pgcrypto;

-- Companies (the builder / GC). One per auth user.
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  contact_email text,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  subscription_status text,
  share_token text unique,
  share_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.subcontractors (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  trade text,
  email text,
  phone text,
  invite_token text not null unique,
  ytd_paid numeric(12,2) not null default 0,
  is_corporation boolean not null default false,
  last_invited_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists subcontractors_company_idx on public.subcontractors(company_id);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  sub_id uuid not null references public.subcontractors(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  doc_type text not null check (doc_type in ('coi_gl','coi_wc','w9','license','agreement')),
  file_path text not null,
  file_name text not null,
  expires_on date,
  uploaded_at timestamptz not null default now()
);
create index if not exists documents_sub_type_idx on public.documents(sub_id, doc_type, uploaded_at desc);
create index if not exists documents_expires_idx on public.documents(expires_on) where expires_on is not null;
create index if not exists documents_company_idx on public.documents(company_id);

create table if not exists public.reminder_log (
  id bigserial primary key,
  document_id uuid not null references public.documents(id) on delete cascade,
  kind text not null check (kind in ('expiring_30','expired')),
  sent_at timestamptz not null default now(),
  unique (document_id, kind)
);

-- ---------- Row Level Security ----------
alter table public.companies enable row level security;
alter table public.subcontractors enable row level security;
alter table public.documents enable row level security;
alter table public.reminder_log enable row level security; -- no policies: service role only

drop policy if exists "owner reads company" on public.companies;
create policy "owner reads company" on public.companies for select using (owner_id = auth.uid());
drop policy if exists "owner creates company" on public.companies;
create policy "owner creates company" on public.companies for insert with check (owner_id = auth.uid());
drop policy if exists "owner updates company" on public.companies;
create policy "owner updates company" on public.companies for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Billing and sharing columns must never be writable from the browser.
revoke insert, update on public.companies from anon, authenticated;
grant insert (owner_id, name, contact_email) on public.companies to authenticated;
grant update (name, contact_email) on public.companies to authenticated;

drop policy if exists "owner manages subs" on public.subcontractors;
create policy "owner manages subs" on public.subcontractors for all
  using (company_id in (select id from public.companies where owner_id = auth.uid()))
  with check (company_id in (select id from public.companies where owner_id = auth.uid()));

drop policy if exists "owner reads docs" on public.documents;
create policy "owner reads docs" on public.documents for select
  using (company_id in (select id from public.companies where owner_id = auth.uid()));
drop policy if exists "owner deletes docs" on public.documents;
create policy "owner deletes docs" on public.documents for delete
  using (company_id in (select id from public.companies where owner_id = auth.uid()));
-- Documents are inserted only by the server (service role) after validating the sub's upload link.

-- ---------- Free plan limit (enforced in the database, not only in the UI) ----------
create or replace function public.enforce_sub_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  st text;
  cnt int;
begin
  select subscription_status into st from public.companies where id = new.company_id;
  if coalesce(st, '') in ('active', 'trialing') then
    return new;
  end if;
  select count(*) into cnt from public.subcontractors where company_id = new.company_id;
  if cnt >= 3 then
    raise exception 'FREE_LIMIT_REACHED';
  end if;
  return new;
end $$;

drop trigger if exists subcontractors_limit on public.subcontractors;
create trigger subcontractors_limit before insert on public.subcontractors
  for each row execute function public.enforce_sub_limit();

-- ---------- Storage ----------
-- Private bucket. All reads/writes go through the server with signed URLs.
insert into storage.buckets (id, name, public, file_size_limit)
values ('documents', 'documents', false, 15728640)
on conflict (id) do nothing;
