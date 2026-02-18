-- Tabelas para persistência de carrinho e histórico
create extension if not exists pgcrypto;

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_item_id text unique not null,
  client_id uuid not null,
  student_id uuid not null references students(id) on delete cascade,
  course_id text not null,
  course_snapshot jsonb not null,
  status text not null default 'active', -- active | removed | purchased
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cart_items_student_idx on cart_items (student_id);
create index if not exists cart_items_status_idx on cart_items (student_id, status);

create table if not exists cart_history (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null,
  student_id uuid not null references students(id) on delete cascade,
  cart_item_id text not null,
  course_id text not null,
  action text not null, -- added | removed | purchased
  course_snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists cart_history_student_idx on cart_history (student_id);
