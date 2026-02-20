-- Adiciona colunas necessárias na tabela courses
alter table if exists courses add column if not exists date date;
alter table if exists courses add column if not exists capacity integer;
alter table if exists courses add column if not exists description text;
alter table if exists courses add column if not exists instagram text;
alter table if exists courses add column if not exists created_at timestamp with time zone;
