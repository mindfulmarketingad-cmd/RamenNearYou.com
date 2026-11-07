-- listing_edit_requests: Owner-submitted edits awaiting admin approval
create table if not exists public.listing_edit_requests (
  id               uuid primary key default gen_random_uuid(),
  restaurant_slug  text not null,
  user_id          uuid not null references auth.users(id) on delete cascade,
  type             text not null,  -- 'info' | 'photo' | 'review_response'
  payload          jsonb not null default '{}',
  -- info payload:    { field: string, old_value: string, new_value: string }
  -- photo payload:   { url: string, caption: string }
  -- review_response: { review_id: string, review_body: string, response: string }
  status           text not null default 'pending',  -- 'pending' | 'approved' | 'rejected'
  admin_note       text,
  created_at       timestamptz default now(),
  reviewed_at      timestamptz
);

create index if not exists listing_edit_requests_slug_idx on public.listing_edit_requests (restaurant_slug);
create index if not exists listing_edit_requests_user_idx on public.listing_edit_requests (user_id);
create index if not exists listing_edit_requests_status_idx on public.listing_edit_requests (status);

alter table public.listing_edit_requests enable row level security;

-- Owners can read their own requests
create policy "Owners read own listing edit requests"
  on public.listing_edit_requests for select
  using (auth.uid() = user_id);

-- Owners can insert their own requests
create policy "Owners insert listing edit requests"
  on public.listing_edit_requests for insert
  with check (auth.uid() = user_id);

-- review_responses: Approved owner responses to customer reviews
create table if not exists public.review_responses (
  id               uuid primary key default gen_random_uuid(),
  review_id        uuid not null,
  restaurant_slug  text not null,
  user_id          uuid not null references auth.users(id) on delete cascade,
  response         text not null,
  created_at       timestamptz default now(),
  unique(review_id)
);

create index if not exists review_responses_review_idx on public.review_responses (review_id);
create index if not exists review_responses_slug_idx on public.review_responses (restaurant_slug);

alter table public.review_responses enable row level security;

create policy "Anyone can read review responses"
  on public.review_responses for select using (true);
