-- ════════════════════════════════════════════════════════════════════════════
-- Paid listing claims + Featured / Premium add-ons. Idempotent; safe to re-run.
-- Apply on project ucqlkhhjoriakjyeogbx AFTER supabase/owner-portal.sql.
--
-- The site is a static export (no webhook). Postgres reads the Stripe
-- Checkout Session with the Vault secret stripe_secret_key, the same way
-- Ramen Pass did:
--   listing_claim_session(cs_…)   browser return to /owner?session_id=
--   listing_sync_mine()            owner opens the dashboard
--   listing_sync_all()             hourly pg_cron (renewals, cancels, missed returns)
--
-- A paid claim is approved immediately. There is no pending queue and no
-- email to David. Stripe sends receipts, invoices and renewal notices.
-- This file sends the site welcome (on approval) and a short confirmation
-- when Featured, Premium or the billboard subscription first lands.
--
-- Stripe (live):
--   Claim    prod_Va2SyTAj3XBfep  price_1UYsNILlgxXvIOfePjTxwMqP  plink_1UYsNULlgxXvIOfeAIQZ8BV5  $49.99/mo
--   That one subscription is the Featured placement (map pin, city page, state page).
--   Older $29 / $79 / $99 prices are not accepted.
--   No trial. payment_status must be 'paid'.
-- ════════════════════════════════════════════════════════════════════════════

create extension if not exists http with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Same helper owner-portal.sql and ramen-pass-membership.sql already install.
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

alter table public.claims add column if not exists source text;

create table if not exists public.listing_subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  restaurant_slug        text not null,
  user_id                uuid references auth.users(id) on delete set null,
  email                  text,
  product                text not null check (product in ('claim', 'featured', 'premium', 'billboard')),
  stripe_customer_id     text,
  stripe_subscription_id text not null unique,
  stripe_price_id        text,
  status                 text not null,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  synced_at              timestamptz not null default now(),
  created_at             timestamptz not null default now()
);
create index if not exists listing_subscriptions_slug_idx on public.listing_subscriptions (restaurant_slug, product);
create index if not exists listing_subscriptions_user_idx on public.listing_subscriptions (user_id);
alter table public.listing_subscriptions enable row level security;
revoke all on public.listing_subscriptions from anon, authenticated;

-- ── Classifiers ─────────────────────────────────────────────────────────────
create or replace function public.rny_listing_slug(p_ref text)
returns text language sql immutable as $$
  select case
    when p_ref ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:[a-z0-9-]{1,200}$'
      then split_part(p_ref, ':', 2)
    when p_ref ~ '^[a-z0-9-]{1,200}$' then p_ref
    else null
  end
$$;

-- Pass price ids are rejected. Claim is matched by price id first, then by
-- the monthly amount, so a replaced price at the same dollar amount still maps.
create or replace function public.rny_listing_product(p_price_id text, p_amount int, p_interval text, p_name text)
returns text language sql immutable as $$
  select case
    when p_price_id in ('price_1UYGQCLlgxXvIOfeP6P9UHDx', 'price_1UYGQELlgxXvIOfeYFVTXUfa') then null
    when coalesce(p_name, '') ~* 'ramen pass' then null
    when p_price_id = 'price_1UYsNILlgxXvIOfePjTxwMqP' then 'claim'
    when coalesce(p_interval, '') = 'month' and p_amount = 4999 then 'claim'
    else null
  end
$$;

create or replace function public.rny_sub_is_live(p_status text, p_end timestamptz)
returns boolean language sql immutable as $$
  select p_status in ('active', 'past_due')
     and (p_end is null or p_end > now() - interval '2 days')
$$;

-- ── Approve a paid claim. No pending state, no mail to David. ──────────────
create or replace function public.rny_approve_paid_claim(p_uid uuid, p_email text, p_slug text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_dir  public.listing_directory%rowtype;
  v_prev public.claims%rowtype;
begin
  if p_uid is null or p_email is null or p_slug is null then return 'skipped'; end if;
  select * into v_dir from public.listing_directory where restaurant_slug = p_slug;
  if not found then return 'unknown_listing'; end if;

  if exists (
    select 1 from public.claims c
     where c.restaurant_slug = p_slug and c.status = 'approved'
       and c.user_id is distinct from p_uid
       and lower(coalesce(c.contact_email, '')) <> p_email
  ) then
    return 'already_claimed';
  end if;

  select * into v_prev from public.claims c
   where c.restaurant_slug = p_slug
     and (c.user_id = p_uid or lower(coalesce(c.contact_email, '')) = p_email)
   order by (c.status = 'approved') desc, c.created_at desc
   limit 1;

  if found then
    update public.claims
       set status = 'approved',
           source = 'stripe',
           user_id = p_uid,
           contact_email = p_email,
           restaurant_name = coalesce(restaurant_name, v_dir.name),
           restaurant_city = coalesce(restaurant_city, v_dir.city || coalesce(', ' || v_dir.state_code, '')),
           admin_note = 'paid checkout',
           reviewed_at = coalesce(reviewed_at, now())
     where id = v_prev.id;
    return case when v_prev.status = 'approved' then 'already_approved' else 'approved' end;
  end if;

  insert into public.claims (user_id, restaurant_slug, restaurant_name, restaurant_city, contact_name,
                             contact_email, message, status, admin_note, reviewed_at, source)
  values (p_uid, p_slug, v_dir.name, v_dir.city || coalesce(', ' || v_dir.state_code, ''),
          '', p_email, null, 'approved', 'paid checkout', now(), 'stripe');
  return 'approved';
end $$;
revoke all on function public.rny_approve_paid_claim(uuid, text, text) from public, anon, authenticated;

-- Dashboard ownership: legacy (pre-Stripe) approved claims stay.
-- Stripe claims stay only while the $49.99 subscription is live.
create or replace function public.rny_owns(p_slug text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.claims c
     where c.restaurant_slug = p_slug and c.status = 'approved'
       and (c.user_id = auth.uid() or lower(c.contact_email) = public.rny_current_email())
       and (
         coalesce(c.source, '') <> 'stripe'
         or exists (
           select 1 from public.listing_subscriptions s
            where s.restaurant_slug = c.restaurant_slug and s.product = 'claim'
              and public.rny_sub_is_live(s.status, s.current_period_end)
              and (s.user_id = auth.uid() or lower(s.email) = public.rny_current_email())
         )
       )
  )
$$;

-- Self-serve claim without a Checkout Session. Requires the subscription
-- already recorded for this account, then approves. Never queues a review.
create or replace function public.claim_listing(p_slug text, p_contact_name text default null, p_message text default null)
returns json language plpgsql security definer set search_path = public, auth as $$
declare
  v_uid   uuid := auth.uid();
  v_email text := public.rny_current_email();
  v_result text;
begin
  if v_uid is null then raise exception 'not_signed_in'; end if;
  if v_email is null then raise exception 'email_not_verified'; end if;
  if not exists (
    select 1 from public.listing_subscriptions s
     where s.restaurant_slug = p_slug and s.product = 'claim'
       and public.rny_sub_is_live(s.status, s.current_period_end)
       and (s.user_id = v_uid or lower(s.email) = v_email)
  ) then
    raise exception 'payment_required';
  end if;
  if p_contact_name is not null and exists (select 1 from public.claims c where c.restaurant_slug = p_slug and c.user_id = v_uid) then
    update public.claims
       set contact_name = coalesce(nullif(trim(p_contact_name), ''), contact_name),
           message = coalesce(left(p_message, 1000), message)
     where restaurant_slug = p_slug and user_id = v_uid;
  end if;
  v_result := public.rny_approve_paid_claim(v_uid, v_email, p_slug);
  if v_result = 'unknown_listing' then raise exception 'unknown_listing'; end if;
  if v_result = 'already_claimed' then raise exception 'already_claimed'; end if;
  return json_build_object('status', 'approved', 'reason', v_result);
end $$;

-- Welcome email. Pending claims are not emailed to David — payment approves.
create or replace function public.rny_claim_emails()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_name text := public.rny_html(coalesce(new.restaurant_name, new.restaurant_slug));
  v_dash text := 'https://www.ramennearyou.com/owner';
begin
  if new.user_id is null then return new; end if;
  if tg_op = 'UPDATE' and old.status is not distinct from new.status then return new; end if;
  if new.status <> 'approved' then return new; end if;

  perform public.rny_send_email(new.contact_email,
    'Welcome to RamenNearYou — ' || coalesce(new.restaurant_name, 'your listing') || ' is verified',
    '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#222;max-width:560px">'
    || '<p>Hi' || coalesce(' ' || public.rny_html(nullif(new.contact_name, '')), '') || ',</p>'
    || '<p>Thanks for claiming <strong>' || v_name || '</strong> on RamenNearYou. '
    || 'Your $49.99/month subscription is active and you''re the verified owner.</p>'
    || '<p><a href="' || v_dash || '" style="display:inline-block;background:#b5532a;color:#fff;padding:10px 18px;text-decoration:none;border-radius:6px;font-weight:bold">Open your owner dashboard</a></p>'
    || '<p>Sign in there with this email address (' || public.rny_html(new.contact_email) || ') and you can:</p>'
    || '<ul><li>Edit your description, hours, phone, website and menu link</li>'
    || '<li>See how many people viewed your listing and tapped call, directions or reviews</li>'
    || '<li>Show the Verified badge</li>'
    || '<li>Featured placement, labelled Featured / Sponsored: a gold crown pin on the homepage map, the top of your city page, and the top of your state page</li></ul>'
    || '<p>Edits to your hours and description appear with the next daily site update. '
    || 'The pin and the Featured spots are already live. New photos? Reply to this email and we will add them.</p>'
    || '<p>Stripe emails your receipts and renewal notices. You can cancel from those emails, or from the billing button on your dashboard.</p>'
    || '<p>Questions? Just reply to this email.</p>'
    || '<p>— David<br>RamenNearYou</p></div>');
  return new;
end $$;

-- Kept so older deployments can replace it. Add-on products are not sold.
create or replace function public.rny_listing_confirm_email(p_email text, p_slug text, p_product text)
returns void language plpgsql security definer set search_path = public as $$
begin
  return;
end $$;
revoke all on function public.rny_listing_confirm_email(text, text, text) from public, anon, authenticated;

-- ── Write one Checkout Session onto listing_subscriptions ───────────────────
create or replace function public.rny_listing_ingest(p_session jsonb, p_uid uuid, p_require_email text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_sub_id  text;
  v_sub     jsonb;
  v_item    jsonb;
  v_price   jsonb;
  v_price_id text;
  v_amount  int;
  v_interval text;
  v_name    text;
  v_product text;
  v_slug    text;
  v_email   text;
  v_uid     uuid;
  v_end     bigint;
  v_existing_id uuid;
  v_existing_product text;
  v_existing_slug text;
  v_existing_status text;
  v_existing_user uuid;
  v_new     boolean := false;
  v_approve text;
begin
  if p_session->>'status' is distinct from 'complete' then raise exception 'checkout_incomplete'; end if;
  if p_session->>'payment_status' is distinct from 'paid' then raise exception 'checkout_incomplete'; end if;

  v_email := lower(coalesce(p_session->'customer_details'->>'email', ''));
  if v_email = '' then raise exception 'session_not_yours'; end if;
  if p_require_email is not null and v_email <> lower(p_require_email) then raise exception 'session_not_yours'; end if;

  v_slug := public.rny_listing_slug(p_session->>'client_reference_id');
  if v_slug is null then raise exception 'bad_session'; end if;
  if not exists (select 1 from public.listing_directory where restaurant_slug = v_slug) then
    raise exception 'unknown_listing';
  end if;

  v_sub := p_session->'subscription';
  if jsonb_typeof(v_sub) = 'string' then
    v_sub_id := p_session->>'subscription';
    v_sub := public.rny_stripe('GET', 'subscriptions/' || v_sub_id);
  else
    v_sub_id := v_sub->>'id';
  end if;
  if coalesce(v_sub_id, '') = '' then raise exception 'checkout_incomplete'; end if;

  select id, product, restaurant_slug, status, user_id
    into v_existing_id, v_existing_product, v_existing_slug, v_existing_status, v_existing_user
    from public.listing_subscriptions where stripe_subscription_id = v_sub_id;
  if found and v_existing_product is not null and exists (
    select 1 from public.listing_subscriptions s
     where s.id = v_existing_id and s.synced_at > now() - interval '15 minutes'
  ) then
    v_uid := coalesce(p_uid, v_existing_user);
    if v_uid is null then
      select u.id into v_uid from auth.users u
       where lower(u.email) = v_email and u.email_confirmed_at is not null
       order by u.created_at desc limit 1;
    end if;
    if v_existing_product = 'claim' and v_uid is not null then
      v_approve := public.rny_approve_paid_claim(v_uid, v_email, v_existing_slug);
    end if;
    return json_build_object('ok', v_approve is distinct from 'already_claimed', 'product', v_existing_product,
      'slug', v_existing_slug, 'status', v_existing_status, 'claim', v_approve);
  end if;

  v_item := v_sub->'items'->'data'->0;
  if jsonb_typeof(v_item->'price') = 'object' then
    v_price_id := v_item->'price'->>'id';
    v_amount := nullif(v_item->'price'->>'unit_amount', '')::int;
    v_interval := v_item->'price'->'recurring'->>'interval';
    v_name := v_item->'price'->'product'->>'name';
  else
    v_price_id := v_item->>'price';
  end if;
  if v_price_id is null then raise exception 'not_listing_product'; end if;
  if v_amount is null then
    v_price := public.rny_stripe('GET', 'prices/' || v_price_id || '?expand[]=product');
    v_price_id := coalesce(v_price->>'id', v_price_id);
    v_amount := nullif(v_price->>'unit_amount', '')::int;
    v_interval := v_price->'recurring'->>'interval';
    v_name := coalesce(v_price->'product'->>'name', v_name);
  end if;
  v_product := public.rny_listing_product(v_price_id, v_amount, v_interval, v_name);
  if v_product is null then raise exception 'not_listing_product'; end if;

  v_uid := p_uid;
  if v_uid is null then
    select u.id into v_uid from auth.users u
     where lower(u.email) = v_email and u.email_confirmed_at is not null
     order by u.created_at desc limit 1;
  end if;

  v_end := coalesce((v_sub->>'current_period_end')::bigint, (v_item->>'current_period_end')::bigint);
  if v_existing_id is null then
    insert into public.listing_subscriptions (restaurant_slug, user_id, email, product, stripe_customer_id,
      stripe_subscription_id, stripe_price_id, status, current_period_end, cancel_at_period_end, synced_at)
    values (v_slug, v_uid, v_email, v_product, v_sub->>'customer', v_sub_id, v_price_id, v_sub->>'status',
      to_timestamp(v_end), coalesce((v_sub->>'cancel_at_period_end')::boolean, false), now());
    v_new := true;
  else
    update public.listing_subscriptions
       set restaurant_slug = v_slug, user_id = coalesce(v_uid, user_id), email = v_email, product = v_product,
           stripe_customer_id = v_sub->>'customer', stripe_price_id = v_price_id, status = v_sub->>'status',
           current_period_end = to_timestamp(v_end),
           cancel_at_period_end = coalesce((v_sub->>'cancel_at_period_end')::boolean, false),
           synced_at = now()
     where id = v_existing_id;
  end if;

  if v_product = 'claim' and v_uid is not null then
    v_approve := public.rny_approve_paid_claim(v_uid, v_email, v_slug);
  end if;
  if v_new and v_product in ('featured', 'premium', 'billboard') then
    perform public.rny_listing_confirm_email(v_email, v_slug, v_product);
  end if;

  return json_build_object(
    'ok', v_approve is distinct from 'already_claimed',
    'product', v_product,
    'slug', v_slug,
    'status', v_sub->>'status',
    'claim', v_approve);
end $$;
revoke all on function public.rny_listing_ingest(jsonb, uuid, text) from public, anon, authenticated;

create or replace function public.rny_listing_resync(p_sub_id text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_sub jsonb;
  v_row public.listing_subscriptions%rowtype;
  v_item jsonb;
  v_end bigint;
begin
  if p_sub_id is null or p_sub_id !~ '^sub_[A-Za-z0-9]+$' then return; end if;
  select * into v_row from public.listing_subscriptions where stripe_subscription_id = p_sub_id;
  if not found then return; end if;
  begin
    v_sub := public.rny_stripe('GET', 'subscriptions/' || p_sub_id);
    v_item := v_sub->'items'->'data'->0;
    v_end := coalesce((v_sub->>'current_period_end')::bigint, (v_item->>'current_period_end')::bigint);
    update public.listing_subscriptions
       set status = v_sub->>'status',
           current_period_end = to_timestamp(v_end),
           cancel_at_period_end = coalesce((v_sub->>'cancel_at_period_end')::boolean, false),
           stripe_customer_id = coalesce(v_sub->>'customer', stripe_customer_id),
           synced_at = now()
     where stripe_subscription_id = p_sub_id;
  exception when others then
    update public.listing_subscriptions set synced_at = now() where stripe_subscription_id = p_sub_id;
    raise warning 'listing resync % failed: %', p_sub_id, sqlerrm;
  end;
end $$;
revoke all on function public.rny_listing_resync(text) from public, anon, authenticated;

create or replace function public.listing_claim_session(p_session_id text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_email text := public.rny_current_email();
  s jsonb;
begin
  if v_uid is null then raise exception 'not_signed_in'; end if;
  if v_email is null then raise exception 'email_not_verified'; end if;
  if p_session_id !~ '^cs_(live|test)_[A-Za-z0-9]{10,200}$' then raise exception 'bad_session'; end if;
  s := public.rny_stripe('GET', 'checkout/sessions/' || p_session_id || '?expand[]=subscription');
  return public.rny_listing_ingest(s, v_uid, v_email);
end $$;

create or replace function public.my_listing_subscriptions()
returns json language sql stable security definer set search_path = public as $$
  select coalesce(json_agg(json_build_object(
    'slug', s.restaurant_slug,
    'product', s.product,
    'status', s.status,
    'current_period_end', s.current_period_end,
    'cancel_at_period_end', s.cancel_at_period_end,
    'live', public.rny_sub_is_live(s.status, s.current_period_end)
  ) order by s.created_at desc), '[]'::json)
    from public.listing_subscriptions s
   where auth.uid() is not null
     and (s.user_id = auth.uid() or lower(s.email) = public.rny_current_email())
$$;

create or replace function public.listing_portal_url()
returns text language plpgsql security definer set search_path = public as $$
declare v_cus text;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  select stripe_customer_id into v_cus from public.listing_subscriptions
   where stripe_customer_id is not null
     and (user_id = auth.uid() or lower(email) = public.rny_current_email())
   order by created_at desc limit 1;
  if v_cus is null then raise exception 'no_billing'; end if;
  return public.rny_stripe('POST', 'billing_portal/sessions',
    'customer=' || v_cus || '&return_url=https%3A%2F%2Fwww.ramennearyou.com%2Fowner')->>'url';
end $$;

-- Recent Checkout Sessions for one email. Used by the dashboard and the cron.
create or replace function public.rny_listing_scan(p_email text, p_uid uuid, p_limit int)
returns int language plpgsql security definer set search_path = public as $$
declare
  v_list jsonb;
  sess jsonb;
  n int := 0;
begin
  v_list := public.rny_stripe('GET', 'checkout/sessions?limit=' || least(greatest(coalesce(p_limit, 20), 1), 100));
  for sess in select value from jsonb_array_elements(coalesce(v_list->'data', '[]'::jsonb)) loop
    if sess->>'status' = 'complete'
       and (p_email is null or lower(coalesce(sess->'customer_details'->>'email', '')) = lower(p_email))
       and public.rny_listing_slug(sess->>'client_reference_id') is not null then
      begin
        perform public.rny_listing_ingest(sess, p_uid, case when p_email is null then null else lower(p_email) end);
        n := n + 1;
      exception when others then
        null; -- pass checkouts, unknown slugs, unpaid sessions
      end;
    end if;
  end loop;
  return n;
end $$;
revoke all on function public.rny_listing_scan(text, uuid, int) from public, anon, authenticated;

create or replace function public.listing_sync_mine()
returns json language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_email text := public.rny_current_email();
  r record;
begin
  if v_uid is null then raise exception 'not_signed_in'; end if;
  if v_email is null then raise exception 'email_not_verified'; end if;
  for r in select stripe_subscription_id from public.listing_subscriptions
            where user_id = v_uid or lower(email) = v_email loop
    perform public.rny_listing_resync(r.stripe_subscription_id);
  end loop;
  begin
    perform public.rny_listing_scan(v_email, v_uid, 30);
  exception when others then
    raise warning 'listing_sync_mine scan failed: %', sqlerrm;
  end;
  for r in select restaurant_slug from public.listing_subscriptions
            where product = 'claim'
              and public.rny_sub_is_live(status, current_period_end)
              and (user_id = v_uid or lower(email) = v_email) loop
    perform public.rny_approve_paid_claim(v_uid, v_email, r.restaurant_slug);
  end loop;
  return public.my_listing_subscriptions();
end $$;

create or replace function public.listing_sync_all()
returns int language plpgsql security definer set search_path = public as $$
declare r record; n int := 0;
begin
  for r in select stripe_subscription_id from public.listing_subscriptions
            where stripe_subscription_id is not null
              and (status not in ('canceled', 'incomplete_expired') or synced_at > now() - interval '3 days')
              and synced_at < now() - interval '6 hours'
            order by synced_at limit 40 loop
    perform public.rny_listing_resync(r.stripe_subscription_id);
    n := n + 1;
  end loop;
  begin
    n := n + public.rny_listing_scan(null, null, 40);
  exception when others then
    raise warning 'listing checkout scan failed: %', sqlerrm;
  end;
  return n;
end $$;
revoke all on function public.listing_sync_all() from public, anon, authenticated;

-- Public placement feed. Legacy approved claims stay. Stripe claims and
-- Featured/Premium show only while the subscription is live. Lapsed Stripe
-- claims are listed so the browser can drop a badge that an older build baked in.
create or replace function public.listing_placements()
returns json language sql stable security definer set search_path = public as $$
  with live_claim as (
    select c.restaurant_slug
      from public.claims c
     where c.status = 'approved'
       and (
         coalesce(c.source, '') <> 'stripe'
         or exists (
           select 1 from public.listing_subscriptions s
            where s.restaurant_slug = c.restaurant_slug and s.product = 'claim'
              and public.rny_sub_is_live(s.status, s.current_period_end)
         )
       )
  ),
  tiers as (
    -- The $49.99 claim is the Featured placement: gold map pin, city page, state page.
    select s.restaurant_slug, 'featured'::text as tier
      from public.listing_subscriptions s
      join live_claim l on l.restaurant_slug = s.restaurant_slug
     where s.product = 'claim'
       and public.rny_sub_is_live(s.status, s.current_period_end)
     group by s.restaurant_slug
  ),
  slugs as (
    select restaurant_slug from live_claim
    union
    select restaurant_slug from tiers
  )
  select json_build_object(
    'live', coalesce((
      select json_agg(json_build_object(
        'slug', d.restaurant_slug,
        'name', d.name,
        'city', d.city,
        'state_code', d.state_code,
        'path', d.path,
        'claim', exists (select 1 from live_claim l where l.restaurant_slug = d.restaurant_slug),
        'tier', t.tier
      ) order by d.restaurant_slug)
        from slugs s
        join public.listing_directory d on d.restaurant_slug = s.restaurant_slug
        left join tiers t on t.restaurant_slug = s.restaurant_slug
    ), '[]'::json),
    'lapsed', coalesce((
      select json_agg(c.restaurant_slug)
        from public.claims c
       where c.status = 'approved' and c.source = 'stripe'
         and not exists (
           select 1 from public.listing_subscriptions s
            where s.restaurant_slug = c.restaurant_slug and s.product = 'claim'
              and public.rny_sub_is_live(s.status, s.current_period_end)
         )
    ), '[]'::json)
  )
$$;

-- Ramen Pass is no longer sold. Saves are not capped, and lists are not gated.
create or replace function public.rny_pass_save_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  return new;
end $$;

do $$
begin
  if to_regclass('public.pass_lists') is not null then
    execute 'drop policy if exists "own lists insert" on public.pass_lists';
    execute 'drop policy if exists "own lists update" on public.pass_lists';
    execute 'create policy "own lists insert" on public.pass_lists for insert to authenticated with check (user_id = auth.uid())';
    execute 'create policy "own lists update" on public.pass_lists for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())';
  end if;
  if to_regclass('public.pass_list_items') is not null then
    execute 'drop policy if exists "own list items insert" on public.pass_list_items';
    execute 'create policy "own list items insert" on public.pass_list_items for insert to authenticated with check (exists (select 1 from public.pass_lists l where l.id = list_id and l.user_id = auth.uid()))';
  end if;
  if to_regclass('public.pass_saves') is null then
    null;
  end if;
end $$;

revoke all on function public.listing_claim_session(text), public.listing_sync_mine(),
  public.my_listing_subscriptions(), public.listing_portal_url(), public.listing_placements()
  from public, anon;
grant execute on function public.listing_claim_session(text), public.listing_sync_mine(),
  public.my_listing_subscriptions(), public.listing_portal_url() to authenticated;
grant execute on function public.listing_placements() to anon, authenticated;

create extension if not exists pg_cron;
select cron.unschedule('rny-listing-sync') where exists (select 1 from cron.job where jobname = 'rny-listing-sync');
select cron.schedule('rny-listing-sync', '41 * * * *', 'select public.listing_sync_all()');
