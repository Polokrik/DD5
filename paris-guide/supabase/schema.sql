-- =============================================================================
-- Schéma Supabase (Postgres) — miroir distant des tables locales
-- =============================================================================
-- Différences avec le schéma SQLite :
--   * `sync_status` n'existe PAS côté serveur (purement local).
--   * `synced_at` n'existe QUE côté serveur : horodatage posé par trigger, utilisé
--     comme curseur de pull (l'horloge des appareils n'est pas fiable).
--   * `deleted` reste un tombstone : on ne supprime jamais physiquement,
--     afin que la suppression se propage à l'autre appareil au prochain pull.
--   * RLS limite l'accès aux membres de la room.
--
-- Mise en place (SQL editor Supabase, une seule fois) :
--   1. Exécuter ce fichier.
--   2. Authentication > Providers > Email : DÉSACTIVER "Allow new users to sign up".
--   3. Authentication > Users : créer les 2 comptes (email + mot de passe).
--   4. Exécuter la section "SEED" en bas de fichier avec les 2 UUID des comptes.
-- =============================================================================

-- Room unique et ses 2 membres ---------------------------------------------
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
  deleted         boolean not null default false,
  synced_at       timestamptz not null default now()
);

-- Votes : id déterministe côté client ("<place_id>_<user_id>") ---------------
create table if not exists votes (
  id          text primary key,
  room_id     text not null references rooms (id) on delete cascade,
  place_id    text not null,
  user_id     uuid not null,
  intent      text not null check (intent in ('want','pass')),
  created_at  timestamptz not null,
  updated_at  timestamptz not null,
  deleted     boolean not null default false,
  synced_at   timestamptz not null default now(),
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
  synced_at   timestamptz not null default now(),
  unique (place_id, user_id)
);

create index if not exists idx_places_room_synced   on places  (room_id, synced_at);
create index if not exists idx_votes_room_synced    on votes   (room_id, synced_at);
create index if not exists idx_reviews_room_synced  on reviews (room_id, synced_at);

-- Trigger : synced_at = now() à chaque écriture (curseur de pull serveur) ----
create or replace function set_synced_at() returns trigger as $$
begin
  new.synced_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_places_synced_at  on places;
drop trigger if exists trg_votes_synced_at   on votes;
drop trigger if exists trg_reviews_synced_at on reviews;
create trigger trg_places_synced_at  before insert or update on places
  for each row execute function set_synced_at();
create trigger trg_votes_synced_at   before insert or update on votes
  for each row execute function set_synced_at();
create trigger trg_reviews_synced_at before insert or update on reviews
  for each row execute function set_synced_at();

-- Row Level Security ---------------------------------------------------------
alter table rooms        enable row level security;
alter table room_members enable row level security;
alter table places       enable row level security;
alter table votes        enable row level security;
alter table reviews      enable row level security;

-- rooms / room_members : LECTURE seule pour les membres. Aucune policy
-- d'écriture : seuls le SQL editor / la service role peuvent ajouter un membre,
-- donc personne ne peut s'inviter dans la room avec la clé anon.
create policy "members read own membership" on room_members
  for select to authenticated
  using (user_id = auth.uid());

create policy "members read their room" on rooms
  for select to authenticated
  using (exists (select 1 from room_members m
                 where m.room_id = rooms.id and m.user_id = auth.uid()));

create policy "room members access places" on places
  for all to authenticated
  using (exists (select 1 from room_members m
                 where m.room_id = places.room_id and m.user_id = auth.uid()))
  with check (exists (select 1 from room_members m
                 where m.room_id = places.room_id and m.user_id = auth.uid()));

create policy "room members access votes" on votes
  for all to authenticated
  using (exists (select 1 from room_members m
                 where m.room_id = votes.room_id and m.user_id = auth.uid()))
  with check (exists (select 1 from room_members m
                 where m.room_id = votes.room_id and m.user_id = auth.uid()));

create policy "room members access reviews" on reviews
  for all to authenticated
  using (exists (select 1 from room_members m
                 where m.room_id = reviews.room_id and m.user_id = auth.uid()))
  with check (exists (select 1 from room_members m
                 where m.room_id = reviews.room_id and m.user_id = auth.uid()));

-- =============================================================================
-- SEED (à exécuter une fois, après création des 2 comptes)
-- Remplacer les UUID par ceux de Authentication > Users.
-- =============================================================================
-- insert into rooms (id) values ('duo-paris');
-- insert into room_members (room_id, user_id) values
--   ('duo-paris', '00000000-0000-0000-0000-000000000001'),
--   ('duo-paris', '00000000-0000-0000-0000-000000000002');
