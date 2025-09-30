-- Supabase schema for CivicVigilance

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  description text,
  category text not null check (category in ('pothole','garbage','streetlight','water','other')),
  image_url text,
  lat double precision,
  lng double precision,
  address text,
  upvotes integer not null default 0,
  downvotes integer not null default 0,
  score integer generated always as (upvotes - downvotes) stored,
  created_at timestamp with time zone default now()
);

alter table public.issues enable row level security;
create policy "Issues are viewable by everyone" on public.issues for select using (true);
create policy "Authenticated can insert issues" on public.issues for insert with check (auth.role() = 'authenticated');
create policy "Owner can update own issues" on public.issues for update using (auth.uid() = user_id);
create index if not exists issues_created_at_idx on public.issues(created_at desc);
create index if not exists issues_score_idx on public.issues(score desc);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamp with time zone default now(),
  unique (user_id, issue_id)
);

alter table public.votes enable row level security;
create policy "Authenticated can upsert own votes" on public.votes for insert with check (auth.role() = 'authenticated');
create policy "Authenticated can change own votes" on public.votes for update using (auth.uid() = user_id);
create policy "Votes viewable by everyone" on public.votes for select using (true);

-- Trigger to update issue counters (upvotes/downvotes)
create or replace function public.update_issue_vote_counters() returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    if (NEW.value = 1) then update public.issues set upvotes = upvotes + 1 where id = NEW.issue_id; else update public.issues set downvotes = downvotes + 1 where id = NEW.issue_id; end if;
  elsif (TG_OP = 'UPDATE') then
    if (OLD.value <> NEW.value) then
      if (NEW.value = 1) then update public.issues set upvotes = upvotes + 1, downvotes = downvotes - 1 where id = NEW.issue_id; else update public.issues set upvotes = upvotes - 1, downvotes = downvotes + 1 where id = NEW.issue_id; end if;
    end if;
  elsif (TG_OP = 'DELETE') then
    if (OLD.value = 1) then update public.issues set upvotes = upvotes - 1 where id = OLD.issue_id; else update public.issues set downvotes = downvotes - 1 where id = OLD.issue_id; end if;
  end if;
  return null;
end;$$ language plpgsql security definer;

drop trigger if exists votes_aggregate on public.votes;
create trigger votes_aggregate after insert or update or delete on public.votes
for each row execute function public.update_issue_vote_counters();

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

alter table public.comments enable row level security;
create policy "Comments viewable by everyone" on public.comments for select using (true);
create policy "Authenticated can add comments" on public.comments for insert with check (auth.role() = 'authenticated');

create index if not exists comments_issue_id_idx on public.comments(issue_id);
create index if not exists comments_parent_id_idx on public.comments(parent_id);

-- Optional: authorities mapping for suggestion
create table if not exists public.authorities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  platform text not null default 'twitter',
  handle text not null,
  region text -- e.g., city or ward name
);
