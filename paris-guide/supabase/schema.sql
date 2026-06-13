-- =============================================================================
-- Schéma Supabase (Postgres) — miroir distant des tables locales
-- =============================================================================
-- Différences avec le schéma SQLite :
--   * `sync_status` n'existe PAS côté serveur (purement local).
--   * `deleted` reste un tombstone : on ne supprime jamais physiquement,
--     afin que la suppression se propage à l'autre appareil au prochain pull.
--   * RLS limite l'accès aux membres de la room.
-- =============================================================================

-- Membres autorisés du binôme (room unique à 2 utilisateurs) ----------------
create table if not exists rooms (
  id          text primary key,
  created_at  timestamptz not null default now()
);

create table if not exists room_members (
  room_id   text not null references rooms (id) on delete cascade,
  user_id   uuid not null references auth.users (id) on delete cascade,
  primary key (room_id, user_id)
);

-- Lieux ---------------------------------------------------------------------
create table if not exists places (
  id              text primary key,
  room_id         text not null references rooms (id) on delete cascade,
  name            text not null,
  category        text not null default 'resto'
                    check (category in ('resto','bar','expo','balade')),
  status          text not null default 'todo'
                    check (status in ('todo','done')),
  is_draft        boolean not null default false,
  google_place_id text,
  address         text,
  lat             double precision,
  lng             double precision,
  created_by      uuid not null,
  created_at      timestamptz not null,
  updated_at      timestamptz not null,
  deleted         boolean not null default false
);

create table if not exists votes (
  id          text primary key,
  room_id     text not null references rooms (id) on delete cascade,
  place_id    text not null,
  user_id     uuid not null,
  intent      text not null check (intent in ('want','pass')),
  created_at  timestamptz not null,
  updated_at  timestamptz not null,
  deleted     boolean not null default false,
  unique (place_id, user_id)
);

create table if not exists reviews (
  id          text primary key,
  room_id     text not null references rooms (id) on delete cascade,
  place_id    text not null,
  user_id     uuid not null,
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null,
  updated_at  timestamptz not null,
  deleted     boolean not null default false,
  unique (place_id, user_id)
);

create index if not exists idx_places_room_updated  on places (room_id, updated_at);
create index if not exists idx_votes_room_updated    on votes (room_id, updated_at);
create index if not exists idx_reviews_room_updated  on reviews (room_id, updated_at);

-- Row Level Security : seuls les membres de la room voient/modifient ses lignes
alter table places  enable row level security;
alter table votes   enable row level security;
alter table reviews enable row level security;

create policy "room members access places" on places
  using (exists (select 1 from room_members m
                 where m.room_id = places.room_id and m.user_id = auth.uid()))
  with check (exists (select 1 from room_members m
                 where m.room_id = places.room_id and m.user_id = auth.uid()));

create policy "room members access votes" on votes
  using (exists (select 1 from room_members m
                 where m.room_id = votes.room_id and m.user_id = auth.uid()))
  with check (exists (select 1 from room_members m
                 where m.room_id = votes.room_id and m.user_id = auth.uid()));

create policy "room members access reviews" on reviews
  using (exists (select 1 from room_members m
                 where m.room_id = reviews.room_id and m.user_id = auth.uid()))
  with check (exists (select 1 from room_members m
                 where m.room_id = reviews.room_id and m.user_id = auth.uid()));
