-- Run this in the Supabase SQL Editor to enable tamper-proof, server-side
-- metering of members-only feature usage (3 free uses / month for signed-in,
-- non-subscribed users). The count lives in Postgres keyed to the user id, so
-- it can't be reset by clearing browser storage.

create table if not exists feature_usage (
  user_id        uuid not null references auth.users(id) on delete cascade,
  billing_period text not null,                -- 'YYYY-MM' (UTC)
  count          int  not null default 0,
  updated_at     timestamptz not null default now(),
  primary key (user_id, billing_period)
);

-- API talks to this table exclusively through the service-role admin client.
alter table feature_usage enable row level security;
create policy "service role full access" on feature_usage
  using (true) with check (true);

-- Atomically spend one use if the user is under the limit. Returns the new
-- count, or -1 if they are already at/over the limit. Atomicity prevents
-- races (e.g. rapid double-clicks / multiple tabs) from over-spending.
create or replace function consume_feature_usage(p_user_id uuid, p_period text, p_limit int)
returns int
language plpgsql
as $$
declare
  new_count int;
begin
  insert into feature_usage (user_id, billing_period, count)
  values (p_user_id, p_period, 0)
  on conflict (user_id, billing_period) do nothing;

  update feature_usage
     set count = count + 1, updated_at = now()
   where user_id = p_user_id
     and billing_period = p_period
     and count < p_limit
  returning count into new_count;

  if new_count is null then
    return -1; -- already at or over the limit
  end if;

  return new_count;
end;
$$;
