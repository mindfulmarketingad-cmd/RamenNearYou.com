-- ════════════════════════════════════════════════════════════════════════════
-- Ramen Pass membership (free accounts + paid Pass). Idempotent; safe to re-run.
--
-- The site is a static export, so the browser talks to Supabase directly and
-- every rule lives here:
--   • RLS on every table; members can only see/write their own rows.
--   • Free accounts: 5 saved spots (trigger), passport check-ins.
--   • Pass status is written ONLY by SECURITY DEFINER functions that read the
--     subscription from Stripe's API (http extension + Stripe key in Vault
--     'stripe_secret_key'). Nothing the browser sends is trusted:
--       pass_claim_session(cs_…)  after checkout (Payment Link redirect)
--       my_pass()                 lazy re-sync when stale
--       pass_sync_all()           hourly pg_cron job (renewals, cancels)
--   • Owner deals: written by verified owners (rny_owns), readable in full
--     only by active members.
-- Stripe: product prod_VZPEfXNWQaQTkd, prices below, portal bpc_1UYGQWLlgxXvIOfeNr9DnXzh.
-- ════════════════════════════════════════════════════════════════════════════

create extension if not exists http with schema extensions;

-- ── Tables ──────────────────────────────────────────────────────────────────
create table if not exists public.pass_members (
  user_id                uuid primary key references auth.users(id) on delete cascade,
  email                  text,
  stripe_customer_id     text,
  stripe_subscription_id text unique,
  plan                   text,              -- monthly | yearly
  status                 text not null default 'none',  -- Stripe subscription status
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  synced_at              timestamptz not null default now(),
  created_at             timestamptz not null default now()
);
alter table public.pass_members enable row level security;

create table if not exists public.pass_settings (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  newsletter_opt_in boolean not null default false,
  home_city         text check (length(home_city) <= 80),
  updated_at        timestamptz not null default now()
);
alter table public.pass_settings enable row level security;

create table if not exists public.pass_saves (
  user_id         uuid not null references auth.users(id) on delete cascade default auth.uid(),
  restaurant_slug text not null check (length(restaurant_slug) between 1 and 200),
  created_at      timestamptz not null default now(),
  primary key (user_id, restaurant_slug)
);
alter table public.pass_saves enable row level security;

create table if not exists public.pass_checkins (
  id              bigint generated always as identity primary key,
  user_id         uuid not null references auth.users(id) on delete cascade default auth.uid(),
  restaurant_slug text not null check (length(restaurant_slug) between 1 and 200),
  bowl            text check (length(bowl) <= 60),
  note            text check (length(note) <= 280),
  visit_day       date not null default ((now() at time zone 'utc')::date),
  created_at      timestamptz not null default now(),
  unique (user_id, restaurant_slug, visit_day)
);
create index if not exists pass_checkins_user_idx on public.pass_checkins (user_id, created_at desc);
alter table public.pass_checkins enable row level security;

create table if not exists public.pass_lists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name       text not null check (length(name) between 1 and 80),
  city       text check (length(city) <= 80),
  trip_date  date,
  notes      text check (length(notes) <= 1000),
  created_at timestamptz not null default now()
);
create index if not exists pass_lists_user_idx on public.pass_lists (user_id);
alter table public.pass_lists enable row level security;

create table if not exists public.pass_list_items (
  list_id         uuid not null references public.pass_lists(id) on delete cascade,
  restaurant_slug text not null check (length(restaurant_slug) between 1 and 200),
  position        int not null default 0,
  note            text check (length(note) <= 280),
  created_at      timestamptz not null default now(),
  primary key (list_id, restaurant_slug)
);
alter table public.pass_list_items enable row level security;

create table if not exists public.owner_deals (
  restaurant_slug text primary key,
  user_id         uuid references auth.users(id) on delete set null,
  deal            text not null check (length(deal) between 3 and 140),
  fine_print      text check (length(fine_print) <= 300),
  active          boolean not null default true,
  updated_at      timestamptz not null default now()
);
alter table public.owner_deals enable row level security;   -- no policies: RPCs only

-- ── Membership check ────────────────────────────────────────────────────────
create or replace function public.rny_pass_active_for(p_uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.pass_members m
     where m.user_id = p_uid
       and m.status in ('active', 'trialing', 'past_due')
       and (m.current_period_end is null or m.current_period_end > now() - interval '2 days'))
$$;
revoke all on function public.rny_pass_active_for(uuid) from public, anon, authenticated;
create or replace function public.rny_pass_active()
returns boolean language sql stable security definer set search_path = public as $$
  select public.rny_pass_active_for(auth.uid())
$$;

-- ── Policies ────────────────────────────────────────────────────────────────
drop policy if exists "own pass row" on public.pass_members;
create policy "own pass row" on public.pass_members for select to authenticated using (user_id = auth.uid());

drop policy if exists "own settings read" on public.pass_settings;
drop policy if exists "own settings insert" on public.pass_settings;
drop policy if exists "own settings update" on public.pass_settings;
create policy "own settings read"   on public.pass_settings for select to authenticated using (user_id = auth.uid());
create policy "own settings insert" on public.pass_settings for insert to authenticated with check (user_id = auth.uid());
create policy "own settings update" on public.pass_settings for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "own saves read" on public.pass_saves;
drop policy if exists "own saves insert" on public.pass_saves;
drop policy if exists "own saves delete" on public.pass_saves;
create policy "own saves read"   on public.pass_saves for select to authenticated using (user_id = auth.uid());
create policy "own saves insert" on public.pass_saves for insert to authenticated with check (user_id = auth.uid());
create policy "own saves delete" on public.pass_saves for delete to authenticated using (user_id = auth.uid());

drop policy if exists "own checkins read" on public.pass_checkins;
drop policy if exists "own checkins insert" on public.pass_checkins;
drop policy if exists "own checkins delete" on public.pass_checkins;
create policy "own checkins read"   on public.pass_checkins for select to authenticated using (user_id = auth.uid());
create policy "own checkins insert" on public.pass_checkins for insert to authenticated with check (user_id = auth.uid());
create policy "own checkins delete" on public.pass_checkins for delete to authenticated using (user_id = auth.uid());

drop policy if exists "own lists read" on public.pass_lists;
drop policy if exists "own lists insert" on public.pass_lists;
drop policy if exists "own lists update" on public.pass_lists;
drop policy if exists "own lists delete" on public.pass_lists;
create policy "own lists read"   on public.pass_lists for select to authenticated using (user_id = auth.uid());
create policy "own lists insert" on public.pass_lists for insert to authenticated with check (user_id = auth.uid() and public.rny_pass_active());
create policy "own lists update" on public.pass_lists for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid() and public.rny_pass_active());
create policy "own lists delete" on public.pass_lists for delete to authenticated using (user_id = auth.uid());

drop policy if exists "own list items read" on public.pass_list_items;
drop policy if exists "own list items insert" on public.pass_list_items;
drop policy if exists "own list items update" on public.pass_list_items;
drop policy if exists "own list items delete" on public.pass_list_items;
create policy "own list items read" on public.pass_list_items for select to authenticated
  using (exists (select 1 from public.pass_lists l where l.id = list_id and l.user_id = auth.uid()));
create policy "own list items insert" on public.pass_list_items for insert to authenticated
  with check (public.rny_pass_active() and exists (select 1 from public.pass_lists l where l.id = list_id and l.user_id = auth.uid()));
create policy "own list items update" on public.pass_list_items for update to authenticated
  using (exists (select 1 from public.pass_lists l where l.id = list_id and l.user_id = auth.uid()))
  with check (exists (select 1 from public.pass_lists l where l.id = list_id and l.user_id = auth.uid()));
create policy "own list items delete" on public.pass_list_items for delete to authenticated
  using (exists (select 1 from public.pass_lists l where l.id = list_id and l.user_id = auth.uid()));

revoke all on public.pass_members, public.owner_deals from anon;
revoke insert, update, delete on public.pass_members from authenticated;
revoke all on public.pass_settings, public.pass_saves, public.pass_checkins, public.pass_lists, public.pass_list_items from anon;
grant select, insert, update on public.pass_settings to authenticated;
grant select, insert, delete on public.pass_saves, public.pass_checkins to authenticated;
grant select, insert, update, delete on public.pass_lists, public.pass_list_items to authenticated;
grant select on public.pass_members to authenticated;

-- Free accounts keep up to 5 saves; the Pass removes the limit.
create or replace function public.rny_pass_save_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.rny_pass_active_for(new.user_id)
     and (select count(*) from public.pass_saves s where s.user_id = new.user_id) >= 5 then
    raise exception 'save_limit';
  end if;
  return new;
end $$;
drop trigger if exists pass_save_limit on public.pass_saves;
create trigger pass_save_limit before insert on public.pass_saves
  for each row execute function public.rny_pass_save_limit();

-- At most 300 lists items / 50 lists per member, 20 check-ins a day (abuse guard).
create or replace function public.rny_pass_lists_cap()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.pass_lists where user_id = new.user_id) >= 50 then raise exception 'too_many'; end if;
  return new;
end $$;
create or replace function public.rny_pass_items_cap()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.pass_list_items where list_id = new.list_id) >= 300 then raise exception 'too_many'; end if;
  return new;
end $$;
create or replace function public.rny_pass_checkins_cap()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.pass_checkins where user_id = new.user_id
       and visit_day = (now() at time zone 'utc')::date) >= 20 then raise exception 'too_many'; end if;
  return new;
end $$;
drop function if exists public.rny_pass_row_caps() cascade;
drop trigger if exists pass_lists_cap on public.pass_lists;
create trigger pass_lists_cap before insert on public.pass_lists for each row execute function public.rny_pass_lists_cap();
drop trigger if exists pass_list_items_cap on public.pass_list_items;
create trigger pass_list_items_cap before insert on public.pass_list_items for each row execute function public.rny_pass_items_cap();
drop trigger if exists pass_checkins_cap on public.pass_checkins;
create trigger pass_checkins_cap before insert on public.pass_checkins for each row execute function public.rny_pass_checkins_cap();
-- visit_day can't be forged into the past/future from the browser
create or replace function public.rny_pass_checkin_day()
returns trigger language plpgsql as $$
begin new.visit_day := (now() at time zone 'utc')::date; new.created_at := now(); return new; end $$;
drop trigger if exists pass_checkins_day on public.pass_checkins;
create trigger pass_checkins_day before insert on public.pass_checkins for each row execute function public.rny_pass_checkin_day();

-- ── Stripe (server side only) ───────────────────────────────────────────────
create or replace function public.rny_stripe(p_method text, p_path text, p_body text default null)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  v_key text;
  r extensions.http_response;
begin
  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'stripe_secret_key' limit 1;
  if v_key is null then raise exception 'stripe_not_configured'; end if;
  perform extensions.http_set_curlopt('CURLOPT_TIMEOUT', '12');
  select * into r from extensions.http((
    p_method, 'https://api.stripe.com/v1/' || p_path,
    array[extensions.http_header('Authorization', 'Bearer ' || v_key)],
    case when p_body is null then null else 'application/x-www-form-urlencoded' end,
    p_body)::extensions.http_request);
  if r.status >= 400 then raise exception 'stripe_error_%', r.status; end if;
  return r.content::jsonb;
end $$;
revoke all on function public.rny_stripe(text, text, text) from public, anon, authenticated;

create or replace function public.rny_pass_plan(p_price text)
returns text language sql immutable as $$
  select case p_price
    when 'price_1UYGQCLlgxXvIOfeP6P9UHDx' then 'monthly'
    when 'price_1UYGQELlgxXvIOfeYFVTXUfa' then 'yearly' end
$$;

-- Write one Stripe subscription object onto a member row.
create or replace function public.rny_pass_apply(p_uid uuid, p_sub jsonb, p_email text default null)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_item jsonb := p_sub->'items'->'data'->0;
  v_plan text := public.rny_pass_plan(v_item->'price'->>'id');
  v_end  bigint := coalesce((p_sub->>'current_period_end')::bigint, (v_item->>'current_period_end')::bigint,
                            (p_sub->>'trial_end')::bigint);
begin
  if v_plan is null then raise exception 'not_ramen_pass'; end if;
  insert into public.pass_members as m (user_id, email, stripe_customer_id, stripe_subscription_id, plan, status,
                                        current_period_end, cancel_at_period_end, synced_at)
  values (p_uid, p_email, p_sub->>'customer', p_sub->>'id', v_plan, p_sub->>'status',
          to_timestamp(v_end), coalesce((p_sub->>'cancel_at_period_end')::boolean, false), now())
  on conflict (user_id) do update set
    email = coalesce(excluded.email, m.email), stripe_customer_id = excluded.stripe_customer_id,
    stripe_subscription_id = excluded.stripe_subscription_id, plan = excluded.plan, status = excluded.status,
    current_period_end = excluded.current_period_end, cancel_at_period_end = excluded.cancel_at_period_end,
    synced_at = now();
end $$;
revoke all on function public.rny_pass_apply(uuid, jsonb, text) from public, anon, authenticated;

-- Called by /account after Stripe Checkout redirects back with ?session_id=cs_…
create or replace function public.pass_claim_session(p_session_id text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_uid   uuid := auth.uid();
  v_email text := public.rny_current_email();
  s       jsonb;
  v_sub   jsonb;
  v_other uuid;
begin
  if v_uid is null then raise exception 'not_signed_in'; end if;
  if v_email is null then raise exception 'email_not_verified'; end if;
  if p_session_id !~ '^cs_(live|test)_[A-Za-z0-9]{10,200}$' then raise exception 'bad_session'; end if;
  s := public.rny_stripe('GET', 'checkout/sessions/' || p_session_id || '?expand[]=subscription');
  if s->>'payment_link' not in ('plink_1UYGQMLlgxXvIOfeQYOJhnpB', 'plink_1UYGQPLlgxXvIOfeORZqVl0f') then raise exception 'bad_session'; end if;
  if s->>'status' <> 'complete' then raise exception 'checkout_incomplete'; end if;
  if coalesce(s->>'client_reference_id', '') <> v_uid::text
     and lower(coalesce(s->'customer_details'->>'email', '')) <> v_email then
    raise exception 'session_not_yours';
  end if;
  v_sub := s->'subscription';
  if jsonb_typeof(v_sub) <> 'object' then raise exception 'checkout_incomplete'; end if;
  select user_id into v_other from public.pass_members where stripe_subscription_id = v_sub->>'id' and user_id <> v_uid;
  if v_other is not null then raise exception 'session_not_yours'; end if;
  perform public.rny_pass_apply(v_uid, v_sub, v_email);
  insert into public.pass_settings (user_id, newsletter_opt_in) values (v_uid, true) on conflict (user_id) do nothing;
  return public.my_pass();
end $$;

create or replace function public.rny_pass_resync(p_uid uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_sub text;
begin
  select stripe_subscription_id into v_sub from public.pass_members where user_id = p_uid;
  if v_sub is null then return; end if;
  begin
    perform public.rny_pass_apply(p_uid, public.rny_stripe('GET', 'subscriptions/' || v_sub));
  exception when others then
    update public.pass_members set synced_at = now() where user_id = p_uid;  -- back off, retry later
    raise warning 'pass resync % failed: %', p_uid, sqlerrm;
  end;
end $$;
revoke all on function public.rny_pass_resync(uuid) from public, anon, authenticated;

create or replace function public.my_pass()
returns json language plpgsql security definer set search_path = public as $$
declare m public.pass_members%rowtype;
begin
  if auth.uid() is null then return json_build_object('signed_in', false, 'active', false); end if;
  select * into m from public.pass_members where user_id = auth.uid();
  if found and m.stripe_subscription_id is not null and m.status not in ('canceled', 'incomplete_expired')
     and (m.synced_at < now() - interval '12 hours' or m.current_period_end < now()) then
    perform public.rny_pass_resync(auth.uid());
    select * into m from public.pass_members where user_id = auth.uid();
  end if;
  return json_build_object(
    'signed_in', true,
    'active', public.rny_pass_active(),
    'status', coalesce(m.status, 'none'),
    'plan', m.plan,
    'current_period_end', m.current_period_end,
    'cancel_at_period_end', coalesce(m.cancel_at_period_end, false),
    'has_billing', m.stripe_customer_id is not null);
end $$;

-- One-time Stripe customer-portal link (cancel, change card, invoices).
create or replace function public.pass_portal_url()
returns text language plpgsql security definer set search_path = public as $$
declare v_cus text;
begin
  select stripe_customer_id into v_cus from public.pass_members where user_id = auth.uid();
  if v_cus is null then raise exception 'no_billing'; end if;
  return public.rny_stripe('POST', 'billing_portal/sessions',
    'customer=' || v_cus || '&configuration=bpc_1UYGQWLlgxXvIOfeNr9DnXzh'
    || '&return_url=https%3A%2F%2Fwww.ramennearyou.com%2Faccount')->>'url';
end $$;

-- Hourly: renewals, cancellations, failed payments.
create or replace function public.pass_sync_all()
returns int language plpgsql security definer set search_path = public as $$
declare r record; n int := 0;
begin
  for r in select user_id from public.pass_members
            where stripe_subscription_id is not null
              and (status not in ('canceled', 'incomplete_expired') or synced_at > now() - interval '3 days')
              and synced_at < now() - interval '6 hours'
            order by synced_at limit 100 loop
    perform public.rny_pass_resync(r.user_id);
    n := n + 1;
  end loop;
  return n;
end $$;
revoke all on function public.pass_sync_all() from public, anon, authenticated;

-- ── Saves / passport (read helpers joined with the listing directory) ──────
create or replace function public.my_pass_saves()
returns json language sql stable security definer set search_path = public as $$
  select coalesce(json_agg(json_build_object('slug', s.restaurant_slug, 'name', d.name, 'city', d.city,
           'state_code', d.state_code, 'path', d.path, 'saved_at', s.created_at) order by s.created_at desc), '[]'::json)
    from public.pass_saves s left join public.listing_directory d on d.restaurant_slug = s.restaurant_slug
   where s.user_id = auth.uid()
$$;

create or replace function public.my_checkins()
returns json language sql stable security definer set search_path = public as $$
  select coalesce(json_agg(json_build_object('id', c.id, 'slug', c.restaurant_slug, 'name', d.name, 'city', d.city,
           'state_code', d.state_code, 'path', d.path, 'bowl', c.bowl, 'note', c.note, 'at', c.created_at)
           order by c.created_at desc), '[]'::json)
    from public.pass_checkins c left join public.listing_directory d on d.restaurant_slug = c.restaurant_slug
   where c.user_id = auth.uid()
$$;

-- ── Member deals ────────────────────────────────────────────────────────────
create or replace function public.owner_deal(p_slug text)
returns json language plpgsql stable security definer set search_path = public as $$
declare d public.owner_deals%rowtype;
begin
  if not public.rny_owns(p_slug) then raise exception 'not_owner'; end if;
  select * into d from public.owner_deals where restaurant_slug = p_slug;
  if not found then return null; end if;
  return json_build_object('deal', d.deal, 'fine_print', d.fine_print, 'active', d.active, 'updated_at', d.updated_at);
end $$;

create or replace function public.save_owner_deal(p_slug text, p_deal text, p_fine_print text, p_active boolean)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not public.rny_owns(p_slug) then raise exception 'not_owner'; end if;
  if nullif(trim(p_deal), '') is null then
    delete from public.owner_deals where restaurant_slug = p_slug;
    return json_build_object('ok', true, 'removed', true);
  end if;
  if length(trim(p_deal)) > 140 or length(coalesce(p_fine_print, '')) > 300 then raise exception 'too_long'; end if;
  insert into public.owner_deals (restaurant_slug, user_id, deal, fine_print, active, updated_at)
  values (p_slug, auth.uid(), trim(p_deal), nullif(trim(p_fine_print), ''), coalesce(p_active, true), now())
  on conflict (restaurant_slug) do update set user_id = excluded.user_id, deal = excluded.deal,
    fine_print = excluded.fine_print, active = excluded.active, updated_at = now();
  return json_build_object('ok', true);
end $$;

-- Listing page: everyone learns whether a member deal exists; members get the text.
create or replace function public.listing_deal(p_slug text)
returns json language sql stable security definer set search_path = public as $$
  select case when d.restaurant_slug is null then json_build_object('has_deal', false)
              when public.rny_pass_active() then json_build_object('has_deal', true, 'deal', d.deal, 'fine_print', d.fine_print)
              else json_build_object('has_deal', true) end
    from (select 1) x
    left join public.owner_deals d on d.restaurant_slug = p_slug and d.active
           and exists (select 1 from public.claims c where c.restaurant_slug = d.restaurant_slug and c.status = 'approved')
$$;

create or replace function public.member_deals()
returns json language plpgsql stable security definer set search_path = public as $$
declare r json;
begin
  if not public.rny_pass_active() then raise exception 'pass_required'; end if;
  select coalesce(json_agg(json_build_object('slug', d.restaurant_slug, 'name', l.name, 'city', l.city,
           'state_code', l.state_code, 'path', l.path, 'deal', d.deal, 'fine_print', d.fine_print)
           order by l.state_code, l.city, l.name), '[]'::json) into r
    from public.owner_deals d join public.listing_directory l on l.restaurant_slug = d.restaurant_slug
   where d.active and exists (select 1 from public.claims c where c.restaurant_slug = d.restaurant_slug and c.status = 'approved');
  return r;
end $$;

-- ── Grants ──────────────────────────────────────────────────────────────────
revoke all on function public.pass_claim_session(text), public.my_pass(), public.pass_portal_url(),
  public.my_pass_saves(), public.my_checkins(), public.owner_deal(text),
  public.save_owner_deal(text, text, text, boolean), public.member_deals(), public.rny_pass_active(),
  public.listing_deal(text) from public, anon;
grant execute on function public.pass_claim_session(text), public.my_pass(), public.pass_portal_url(),
  public.my_pass_saves(), public.my_checkins(), public.owner_deal(text),
  public.save_owner_deal(text, text, text, boolean), public.member_deals(), public.rny_pass_active(),
  public.listing_deal(text) to authenticated;
grant execute on function public.listing_deal(text) to anon;

-- ── Hourly sync job ─────────────────────────────────────────────────────────
create extension if not exists pg_cron;
select cron.unschedule('rny-pass-sync') where exists (select 1 from cron.job where jobname = 'rny-pass-sync');
select cron.schedule('rny-pass-sync', '17 * * * *', 'select public.pass_sync_all()');

-- ════════════════════════════════════════════════════════════════════════════
-- STRIPE KEY (run separately, once):
--   select vault.create_secret('sk_live_…', 'stripe_secret_key');
-- ════════════════════════════════════════════════════════════════════════════
