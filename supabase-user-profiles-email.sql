-- Run this in your Supabase SQL Editor (Database > SQL Editor).
--
-- Adds a plain `email` column to public.user_profiles so emails show up
-- directly in the Table Editor / CSV export instead of being hidden behind
-- the user_id UUID (which requires clicking into auth.users to see).
--
-- A trigger on auth.users keeps it in sync automatically going forward —
-- for new signups AND if someone changes their email later — regardless of
-- which auth flow they used (password, magic link, OAuth, etc.), so you
-- don't have to rely on the app's own code path to populate it.

alter table public.user_profiles add column if not exists email text;

-- Backfill every existing row from auth.users.
update public.user_profiles p
set email = u.email
from auth.users u
where p.user_id = u.id
  and (p.email is distinct from u.email);

-- Keep user_profiles.email in sync with auth.users.email going forward.
create or replace function public.sync_user_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_sync on auth.users;
create trigger on_auth_user_email_sync
  after insert or update of email on auth.users
  for each row execute function public.sync_user_profile_email();
