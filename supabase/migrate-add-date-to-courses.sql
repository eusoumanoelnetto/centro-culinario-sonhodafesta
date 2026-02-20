-- Adiciona a coluna 'date' na tabela courses, se não existir
alter table if exists courses add column if not exists date date;
