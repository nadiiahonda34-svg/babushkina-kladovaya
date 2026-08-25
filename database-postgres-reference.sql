-- PostgreSQL / Supabase schema for production
create extension if not exists pgcrypto;

create type recipe_status as enum ('draft','pending','published','rejected');
create table profiles (
  id uuid primary key,
  display_name text not null,
  role text not null default 'user' check (role in ('user','moderator','admin')),
  created_at timestamptz not null default now()
);
create table recipes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id),
  slug text unique not null,
  title text not null,
  description text not null,
  story text,
  category text not null,
  cuisine text,
  prep_minutes int check (prep_minutes >= 0),
  cook_minutes int check (cook_minutes >= 0),
  servings int check (servings > 0),
  image_url text,
  status recipe_status not null default 'pending',
  safety_notes text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table ingredients (
  id bigserial primary key, recipe_id uuid references recipes(id) on delete cascade,
  position int not null, text text not null
);
create table steps (
  id bigserial primary key, recipe_id uuid references recipes(id) on delete cascade,
  position int not null, text text not null
);
create table reviews (
  id uuid primary key default gen_random_uuid(), recipe_id uuid references recipes(id) on delete cascade,
  user_id uuid references profiles(id), rating int not null check (rating between 1 and 5),
  body text, status text not null default 'pending', created_at timestamptz not null default now(),
  unique(recipe_id,user_id)
);
create table favorites (
  user_id uuid references profiles(id), recipe_id uuid references recipes(id) on delete cascade,
  created_at timestamptz not null default now(), primary key(user_id,recipe_id)
);
create table moderation_events (
  id bigserial primary key, recipe_id uuid references recipes(id) on delete cascade,
  moderator_id uuid references profiles(id), action text not null, note text, created_at timestamptz default now()
);
create index recipes_published_idx on recipes(status,published_at desc);
create index recipes_category_idx on recipes(category);
create index reviews_recipe_idx on reviews(recipe_id,status);
