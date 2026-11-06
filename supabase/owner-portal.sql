-- ════════════════════════════════════════════════════════════════════════════
-- Owner portal: self-serve claiming, auto-approval, owner edits, emails.
--
-- Run once in Supabase → SQL Editor → New query → paste → Run.
-- Safe to re-run (idempotent).
--
-- The site is a static export, so the browser talks to Supabase directly.
-- Every security decision is made HERE, inside Postgres:
--   • claim_listing()  decides approved vs pending from the signed-in user's
--                      VERIFIED auth email and the listing website stored in
--                      listing_directory (never from anything the client sends)
--   • guard triggers   stop browser roles (anon/authenticated) from writing
--                      claim status or other owners' overrides directly
--   • emails           are sent from Postgres via pg_net → Resend, using a
--                      key kept in Supabase Vault (see the end of this file)
-- ════════════════════════════════════════════════════════════════════════════

create extension if not exists pg_net with schema extensions;

-- ── Listing directory (synced from lib/restaurants.json by
--    scripts/sync-listing-directory.mjs on every production build) ──────────
create table if not exists public.listing_directory (
  restaurant_slug text primary key,
  name            text not null,
  city            text,
  state_code      text,
  path            text,          -- /city/state/slug
  website         text,
  phone           text,
  description     text,
  hours           jsonb,
  menu_link       text,
  updated_at      timestamptz not null default now()
);
alter table public.listing_directory enable row level security;
-- No policies on purpose: browser roles can't read it directly; only the
-- SECURITY DEFINER functions below (and the service role) can.

-- ── Owner-portal admins ─────────────────────────────────────────────────────
create table if not exists public.owner_portal_admins (email text primary key);
alter table public.owner_portal_admins enable row level security;
insert into public.owner_portal_admins (email) values ('mindfulmarketingad@gmail.com')
  on conflict do nothing;

-- ── Helpers ─────────────────────────────────────────────────────────────────
create or replace function public.rny_normalize_host(u text)
returns text language sql immutable as $$
  select nullif(
    regexp_replace(
      regexp_replace(
        split_part(split_part(split_part(regexp_replace(lower(trim(coalesce(u, ''))), '^[a-z][a-z0-9+.-]*://', ''), '/', 1), '?', 1), '#', 1),
        ':[0-9]+$', ''),
      '^www[0-9]*\.', ''),
    '')
$$;

create or replace function public.rny_is_generic_email_domain(d text)
returns boolean language sql immutable as $$
  select lower(d) = any (array[
    'gmail.com','googlemail.com','yahoo.com','ymail.com','rocketmail.com','outlook.com','hotmail.com',
    'live.com','msn.com','icloud.com','me.com','mac.com','aol.com','proton.me','protonmail.com','pm.me',
    'gmx.com','gmx.net','mail.com','zoho.com','zohomail.com','yandex.com','hey.com','fastmail.com',
    'comcast.net','att.net','sbcglobal.net','verizon.net','cox.net','charter.net','spectrum.net',
    'earthlink.net','bellsouth.net','optonline.net','frontier.com','windstream.net','juno.com',
    'qq.com','163.com','126.com','naver.com','daum.net','hanmail.net','yahoo.co.jp','yahoo.ca','hotmail.ca'
  ]) or lower(d) like 'yahoo.%' or lower(d) like 'hotmail.%' or lower(d) like 'outlook.%' or lower(d) like 'live.%'
$$;

-- Website hosts that don't prove ownership (social, ordering, review and
-- site-builder platforms). Matches the host itself or any subdomain.
create or replace function public.rny_is_aggregator_host(h text)
returns boolean language sql immutable as $$
  select exists (
    select 1 from unnest(array[
      'facebook.com','fb.com','fb.me','instagram.com','tiktok.com','twitter.com','x.com','linktr.ee','linkin.bio',
      'yelp.com','tripadvisor.com','google.com','goo.gl','g.page','business.site','maps.app.goo.gl',
      'toasttab.com','toast.site','square.site','squareup.com','clover.com','cloverdining.com','spoton.com',
      'doordash.com','ubereats.com','grubhub.com','seamless.com','postmates.com','caviar.com','chownow.com',
      'menufy.com','slicelife.com','order.online','beyondmenu.com','menupages.com','allmenus.com','opentable.com',
      'resy.com','exploretock.com','sevenrooms.com','popmenu.com','getbento.com','bentobox.com','owner.com',
      'menusifu.com','restaurantji.com','zmenu.com','orderyoyo.com','hungerrush.com','foodbooking.com',
      'wixsite.com','wix.com','godaddysites.com','weebly.com','wordpress.com','blogspot.com','squarespace.com',
      'sites.google.com','carrd.co','webflow.io','netlify.app','vercel.app','github.io','myshopify.com',
      'ezcater.com','gloriafood.com','olo.com','chowbus.com','hungryhub.com','ramennearyou.com'
    ]) as a(d)
    where lower(h) = a.d or lower(h) like '%.' || a.d
  )
$$;

create or replace function public.rny_current_email()
returns text language sql stable security definer set search_path = public, auth as $$
  select lower(u.email) from auth.users u
  where u.id = auth.uid() and u.email_confirmed_at is not null
$$;

create or replace function public.rny_is_portal_admin()
returns boolean language sql stable security definer set search_path = public, auth as $$
  select exists (select 1 from public.owner_portal_admins a where a.email = public.rny_current_email())
$$;

-- ── Email (pg_net → Resend). Silently does nothing until the Vault secret
--    'resend_api_key' exists, so nothing is ever sent by accident. ─────────
create or replace function public.rny_send_email(p_to text, p_subject text, p_html text)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare
  v_key  text;
  v_from text;
begin
  begin
    select decrypted_secret into v_key  from vault.decrypted_secrets where name = 'resend_api_key' limit 1;
    select decrypted_secret into v_from from vault.decrypted_secrets where name = 'rny_email_from' limit 1;
  exception when others then
    return;
  end;
  if v_key is null or p_to is null then return; end if;
  begin
  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization', 'Bearer ' || v_key, 'Content-Type', 'application/json'),
    body    := jsonb_build_object(
      'from',     coalesce(v_from, 'David at RamenNearYou <hello@ramennearyou.com>'),
      'to',       jsonb_build_array(p_to),
      'reply_to', 'mindfulmarketingad@gmail.com',
      'subject',  p_subject,
      'html',     p_html
    )
  );
  exception when others then
    raise warning 'rny_send_email failed: %', sqlerrm;  -- never block the claim itself
  end;
end $$;
revoke all on function public.rny_send_email(text, text, text) from public, anon, authenticated;

create or replace function public.rny_html(t text)
returns text language sql immutable as $$
  select replace(replace(replace(replace(coalesce(t, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;')
$$;

create or replace function public.rny_claim_emails()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_name text := public.rny_html(coalesce(new.restaurant_name, new.restaurant_slug));
  v_slug text := new.restaurant_slug;
  v_dash text := 'https://www.ramennearyou.com/owner';
  v_admin text;
begin
  if new.user_id is null then return new; end if;          -- legacy/manual rows: no email
  if tg_op = 'UPDATE' and old.status is not distinct from new.status then return new; end if;

  if new.status = 'approved' then
    perform public.rny_send_email(new.contact_email,
      'Welcome to RamenNearYou — ' || coalesce(new.restaurant_name, 'your listing') || ' is verified',
      '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#222;max-width:560px">'
      || '<p>Hi' || coalesce(' ' || public.rny_html(nullif(new.contact_name, '')), '') || ',</p>'
      || '<p>Thanks for claiming <strong>' || v_name || '</strong> on RamenNearYou — you''re now the verified owner.</p>'
      || '<p><a href="' || v_dash || '" style="display:inline-block;background:#b5532a;color:#fff;padding:10px 18px;text-decoration:none;border-radius:6px;font-weight:bold">Open your owner dashboard</a></p>'
      || '<p>Sign in there with this email address (' || public.rny_html(new.contact_email) || ') and you can:</p>'
      || '<ul><li>Edit your description, hours, phone, website and menu link</li>'
      || '<li>See how many people viewed your listing and tapped call, directions or reviews</li>'
      || '<li>Show the Verified badge</li>'
      || '<li>Featured placement, labelled Featured / Sponsored: a gold crown pin on the homepage map, the top of your city page, and the top of your state page</li></ul>'
      || '<p>Your $49.99/month subscription includes that placement. Edits appear with the next daily site update. The pin is already live.</p>'
      || '<p>Stripe emails your receipts and renewal notices.</p>'
      || '<p>Questions? Just reply to this email.</p>'
      || '<p>— David<br>RamenNearYou</p></div>');
  elsif new.status = 'pending' then
    select string_agg(email, ',') into v_admin from public.owner_portal_admins;
    perform public.rny_send_email(split_part(v_admin, ',', 1),
      'Claim to review: ' || coalesce(new.restaurant_name, v_slug),
      '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5">'
      || '<p><strong>' || v_name || '</strong> (' || public.rny_html(v_slug) || ') was claimed by '
      || public.rny_html(new.contact_email) || coalesce(' — ' || public.rny_html(nullif(new.contact_name, '')), '') || '.</p>'
      || '<p>Not auto-approved: ' || public.rny_html(coalesce(new.admin_note, '')) || '</p>'
      || '<p><a href="https://www.ramennearyou.com/owner/admin?claim=' || new.id || '&action=approve">Approve</a> · '
      || '<a href="https://www.ramennearyou.com/owner/admin?claim=' || new.id || '&action=reject">Reject</a> · '
      || '<a href="https://www.ramennearyou.com/owner/admin">All pending claims</a></p></div>');
  end if;
  return new;
end $$;

drop trigger if exists rny_claim_emails on public.claims;
create trigger rny_claim_emails after insert or update of status on public.claims
  for each row execute function public.rny_claim_emails();

-- ── Guards: browser roles may not set claim status or touch others' rows ───
-- (The old "Anyone can submit a claim" policy allowed inserting any status.)
create or replace function public.rny_guard_claims()
returns trigger language plpgsql as $$
begin
  if current_user not in ('anon', 'authenticated') then return new; end if;
  if tg_op = 'INSERT' then
    raise exception 'Use claim_listing() to claim a listing';
  else
    if new.status is distinct from old.status
       or new.restaurant_slug is distinct from old.restaurant_slug
       or new.contact_email is distinct from old.contact_email
       or new.admin_note is distinct from old.admin_note
       or new.reviewed_at is distinct from old.reviewed_at then
      raise exception 'Use claim_listing() / review_claim() to change a claim';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists rny_guard_claims on public.claims;
create trigger rny_guard_claims before insert or update on public.claims
  for each row execute function public.rny_guard_claims();

create or replace function public.rny_guard_overrides()
returns trigger language plpgsql as $$
begin
  if current_user not in ('anon', 'authenticated') then return new; end if;
  raise exception 'Use save_listing_override() to edit a listing';
end $$;
-- Not SECURITY DEFINER on purpose: current_user is the caller, so direct
-- browser writes are blocked while save_listing_override() (which runs as
-- its owner) passes.
drop trigger if exists rny_guard_overrides on public.restaurant_overrides;
create trigger rny_guard_overrides before insert or update or delete on public.restaurant_overrides
  for each row execute function public.rny_guard_overrides();

-- ── Public: readiness + listing name for the claim screen ─────────────────
create or replace function public.owner_portal_listing(p_slug text)
returns json language sql stable security definer set search_path = public as $$
  select json_build_object(
    'ready', true,
    'listing', (select json_build_object('slug', d.restaurant_slug, 'name', d.name, 'city', d.city,
                                         'state_code', d.state_code, 'path', d.path,
                                         'has_website', public.rny_normalize_host(d.website) is not null
                                                        and not public.rny_is_aggregator_host(public.rny_normalize_host(d.website)))
                from public.listing_directory d where d.restaurant_slug = p_slug),
    'claimed', exists (select 1 from public.claims c where c.restaurant_slug = p_slug and c.status = 'approved')
  )
$$;

-- ── Claim ───────────────────────────────────────────────────────────────────
-- Paid claims replace this function. supabase/listing-subscriptions.sql
-- (run after this file) makes claim_listing require a $49.99 subscription
-- and approves immediately. Re-run that file if you re-run this one.
create or replace function public.claim_listing(p_slug text, p_contact_name text default null, p_message text default null)
returns json language plpgsql security definer set search_path = public, auth as $$
declare
  v_uid    uuid := auth.uid();
  v_email  text := public.rny_current_email();
  v_dir    public.listing_directory%rowtype;
  v_prev   public.claims%rowtype;
  v_has    boolean;
  v_domain text;
  v_host   text;
  v_reason text;
  v_status text;
  v_id     uuid;
begin
  if v_uid is null then raise exception 'not_signed_in'; end if;
  if v_email is null then raise exception 'email_not_verified'; end if;

  select * into v_dir from public.listing_directory where restaurant_slug = p_slug;
  if not found then raise exception 'unknown_listing'; end if;

  -- Someone else already owns it
  if exists (select 1 from public.claims c
             where c.restaurant_slug = p_slug and c.status = 'approved'
               and c.user_id is distinct from v_uid
               and lower(coalesce(c.contact_email, '')) <> v_email) then
    raise exception 'already_claimed';
  end if;

  select * into v_prev from public.claims c
   where c.restaurant_slug = p_slug and (c.user_id = v_uid or lower(c.contact_email) = v_email)
   order by (c.status = 'approved') desc, c.created_at desc limit 1;
  v_has := found;

  if v_has and v_prev.status = 'approved' then
    update public.claims set user_id = v_uid where id = v_prev.id and user_id is distinct from v_uid;
    return json_build_object('id', v_prev.id, 'status', 'approved', 'reason', 'already_approved');
  end if;
  if v_has and v_prev.status = 'pending' then
    return json_build_object('id', v_prev.id, 'status', 'pending', 'reason', coalesce(v_prev.admin_note, 'pending'));
  end if;

  -- Throttle: at most 5 open claims per account
  if (select count(*) from public.claims where user_id = v_uid and status = 'pending') >= 5 then
    raise exception 'too_many_pending';
  end if;

  v_domain := split_part(v_email, '@', 2);
  v_host   := public.rny_normalize_host(v_dir.website);
  if public.rny_is_generic_email_domain(v_domain) then v_reason := 'generic email domain (' || v_domain || ')';
  elsif v_host is null or position('.' in v_host) = 0 then v_reason := 'listing has no website';
  elsif public.rny_is_aggregator_host(v_host) then v_reason := 'listing website is a platform (' || v_host || ')';
  elsif v_domain = v_host or v_host like '%.' || v_domain or v_domain like '%.' || v_host then v_reason := 'domain match';
  else v_reason := 'email domain ' || v_domain || ' ≠ website ' || v_host;
  end if;
  v_status := case when v_reason = 'domain match' then 'approved' else 'pending' end;

  if v_has then  -- a previously rejected claim: reopen it
    update public.claims
       set status = v_status, user_id = v_uid, contact_email = v_email,
           contact_name = coalesce(nullif(trim(p_contact_name), ''), contact_name),
           message = left(coalesce(p_message, message), 1000),
           admin_note = 'auto: ' || v_reason,
           reviewed_at = case when v_status = 'approved' then now() else null end
     where id = v_prev.id
    returning id into v_id;
  else
    insert into public.claims (user_id, restaurant_slug, restaurant_name, restaurant_city, contact_name,
                               contact_email, message, status, admin_note, reviewed_at)
    values (v_uid, p_slug, v_dir.name, v_dir.city || coalesce(', ' || v_dir.state_code, ''),
            coalesce(left(nullif(trim(p_contact_name), ''), 120), ''), v_email, left(p_message, 1000),
            v_status, 'auto: ' || v_reason, case when v_status = 'approved' then now() end)
    returning id into v_id;
  end if;

  return json_build_object('id', v_id, 'status', v_status, 'reason', v_reason);
end $$;

-- ── Owner dashboard ─────────────────────────────────────────────────────────
create or replace function public.my_claims()
returns json language sql stable security definer set search_path = public as $$
  select coalesce(json_agg(x order by x.created_at desc), '[]'::json) from (
    select c.id, c.restaurant_slug as slug, coalesce(d.name, c.restaurant_name) as name,
           coalesce(d.city, c.restaurant_city) as city, d.state_code, d.path, c.status, c.created_at,
           json_build_object(
             'description', coalesce(o.description, d.description),
             'phone',       coalesce(o.phone, d.phone),
             'website',     coalesce(o.website, d.website),
             'menu_link',   coalesce(o.menu_link, d.menu_link),
             'hours',       coalesce(o.hours, d.hours)) as listing,
           o.updated_at as edited_at
      from public.claims c
      left join public.listing_directory d on d.restaurant_slug = c.restaurant_slug
      left join public.restaurant_overrides o on o.restaurant_slug = c.restaurant_slug and c.status = 'approved'
     where auth.uid() is not null
       and (c.user_id = auth.uid() or (lower(c.contact_email) = public.rny_current_email() and c.status = 'approved'))
       and c.restaurant_slug <> ''
  ) x
$$;

create or replace function public.rny_owns(p_slug text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.claims c
                 where c.restaurant_slug = p_slug and c.status = 'approved'
                   and (c.user_id = auth.uid() or lower(c.contact_email) = public.rny_current_email()))
$$;

create or replace function public.save_listing_override(
  p_slug text, p_description text, p_phone text, p_website text, p_menu_link text, p_hours jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare
  k text;
  v jsonb;
begin
  if not public.rny_owns(p_slug) then raise exception 'not_owner'; end if;
  if length(coalesce(p_description, '')) > 1500 then raise exception 'description_too_long'; end if;
  if length(coalesce(p_phone, '')) > 40 then raise exception 'phone_too_long'; end if;
  if nullif(trim(p_website), '') is not null and (p_website !~* '^https?://[^\s<>"]+$' or length(p_website) > 300) then raise exception 'bad_website'; end if;
  if nullif(trim(p_menu_link), '') is not null and (p_menu_link !~* '^https?://[^\s<>"]+$' or length(p_menu_link) > 300) then raise exception 'bad_menu_link'; end if;
  if p_hours is not null then
    if jsonb_typeof(p_hours) <> 'object' then raise exception 'bad_hours'; end if;
    for k, v in select * from jsonb_each(p_hours) loop
      if k not in ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')
         or jsonb_typeof(v) <> 'array' or jsonb_array_length(v) > 4
         or exists (select 1 from jsonb_array_elements(v) e where jsonb_typeof(e) <> 'string' or length(e #>> '{}') > 40) then
        raise exception 'bad_hours';
      end if;
    end loop;
  end if;

  insert into public.restaurant_overrides (restaurant_slug, user_id, description, phone, website, menu_link, hours, updated_at)
  values (p_slug, auth.uid(), nullif(trim(p_description), ''), nullif(trim(p_phone), ''), nullif(trim(p_website), ''),
          nullif(trim(p_menu_link), ''), p_hours, now())
  on conflict (restaurant_slug) do update set
    user_id = excluded.user_id, description = excluded.description, phone = excluded.phone,
    website = excluded.website, menu_link = excluded.menu_link, hours = excluded.hours, updated_at = now();
  return json_build_object('ok', true, 'updated_at', now());
end $$;

-- Views and taps from the site's own analytics table (ramennearyou_dashboard)
create or replace function public.owner_listing_stats(p_slug text)
returns json language plpgsql stable security definer set search_path = public as $$
declare r json;
begin
  if not (public.rny_owns(p_slug) or public.rny_is_portal_admin()) then raise exception 'not_owner'; end if;
  select json_build_object(
    'views_30d',       count(*) filter (where event_type = 'listing_view'     and created_at >= now() - interval '30 days'),
    'calls_30d',       count(*) filter (where event_type = 'call_click'       and created_at >= now() - interval '30 days'),
    'directions_30d',  count(*) filter (where event_type = 'directions_click' and created_at >= now() - interval '30 days'),
    'reviews_30d',     count(*) filter (where event_type = 'review_click'     and created_at >= now() - interval '30 days'),
    'views_prev_30d',  count(*) filter (where event_type = 'listing_view'     and created_at <  now() - interval '30 days'),
    'views_all',       (select count(*) from public.ramennearyou_dashboard t where t.listing_slug = p_slug and t.event_type = 'listing_view'))
  into r
  from public.ramennearyou_dashboard
  where listing_slug = p_slug and created_at >= now() - interval '60 days';
  return r;
end $$;

-- ── Admin (David) ───────────────────────────────────────────────────────────
create or replace function public.admin_list_claims(p_status text default 'pending')
returns json language plpgsql stable security definer set search_path = public as $$
declare r json;
begin
  if not public.rny_is_portal_admin() then raise exception 'not_admin'; end if;
  select coalesce(json_agg(x order by x.created_at desc), '[]'::json) into r from (
    select c.id, c.restaurant_slug as slug, c.restaurant_name as name, c.restaurant_city as city, c.contact_name,
           c.contact_email, c.message, c.status, c.admin_note, c.created_at, c.reviewed_at, d.website, d.path
      from public.claims c left join public.listing_directory d on d.restaurant_slug = c.restaurant_slug
     where p_status is null or c.status = p_status
     limit 200
  ) x;
  return r;
end $$;

create or replace function public.review_claim(p_id uuid, p_approve boolean, p_note text default null)
returns json language plpgsql security definer set search_path = public as $$
declare v public.claims%rowtype;
begin
  if not public.rny_is_portal_admin() then raise exception 'not_admin'; end if;
  select * into v from public.claims where id = p_id;
  if not found then raise exception 'not_found'; end if;
  if p_approve and exists (select 1 from public.claims c where c.restaurant_slug = v.restaurant_slug
                           and c.status = 'approved' and c.id <> p_id) then
    raise exception 'already_claimed';
  end if;
  update public.claims
     set status = case when p_approve then 'approved' else 'rejected' end,
         reviewed_at = now(),
         admin_note = coalesce(nullif(trim(p_note), ''), admin_note, '') || ' · reviewed by ' || public.rny_current_email()
   where id = p_id;
  return json_build_object('id', p_id, 'status', case when p_approve then 'approved' else 'rejected' end);
end $$;

-- ── Grants ──────────────────────────────────────────────────────────────────
revoke all on function public.claim_listing(text, text, text), public.my_claims(), public.rny_owns(text),
  public.save_listing_override(text, text, text, text, text, jsonb), public.owner_listing_stats(text),
  public.admin_list_claims(text), public.review_claim(uuid, boolean, text) from public, anon;
grant execute on function public.claim_listing(text, text, text), public.my_claims(),
  public.save_listing_override(text, text, text, text, text, jsonb), public.owner_listing_stats(text),
  public.admin_list_claims(text), public.review_claim(uuid, boolean, text) to authenticated;
grant execute on function public.owner_portal_listing(text) to anon, authenticated;
revoke all on function public.rny_claim_emails(), public.rny_current_email(), public.rny_is_portal_admin()
  from public, anon;
grant execute on function public.rny_current_email(), public.rny_is_portal_admin(), public.rny_owns(text) to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- EMAIL SETUP (run separately, after verifying your sending domain in Resend):
--
--   select vault.create_secret('re_xxx_your_resend_key', 'resend_api_key');
--   select vault.create_secret('David at RamenNearYou <hello@ramennearyou.com>', 'rny_email_from');
--
-- Until 'resend_api_key' exists, no welcome / review emails are sent.
-- ════════════════════════════════════════════════════════════════════════════
