import dotenv from 'dotenv'
import pg from 'pg'
import { CLIENT_ID } from '../services/supabase.ts'

dotenv.config({ path: '.env.local', override: true })
dotenv.config({ override: true })

const { Client } = pg

const dbUrl = process.env.SUPABASE_DB_URL

if (!dbUrl) {
  console.error('❌ SUPABASE_DB_URL nao encontrado. Adicione no .env.local')
  console.error('   Exemplo: SUPABASE_DB_URL=postgres://USER:PASSWORD@HOST:PORT/postgres')
  console.error('   Se a senha tiver caracteres especiais (@, #, etc), codifique-os:')
  console.error('   @ = %40, # = %23, etc.')
  process.exit(1)
}

const sql = `
drop schema if exists alunos cascade;

-- Remover tabela students antiga se existir
drop table if exists public.students cascade;

-- Criar tabela students com todas as colunas
create table public.students (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  email text not null,
  cpf text,
  whatsapp text,
  password text,
  first_access boolean default true,
  status text default 'Pendente',
  course text,
  source text check (source in ('admin','self-service')),
  lead_tag text,
  last_contact_note text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

create unique index if not exists students_client_email_idx
  on public.students (client_id, email);

-- Enable Row Level Security
alter table public.students enable row level security;

-- Policy: Anyone can insert (self-registration)
drop policy if exists "Allow public insert" on public.students;
create policy "Allow public insert" on public.students
  for insert
  with check (true);

-- Policy: Anyone can read (for login/authentication)
drop policy if exists "Allow public select" on public.students;
create policy "Allow public select" on public.students
  for select
  using (true);

-- Policy: Anyone can update (for password changes)
drop policy if exists "Allow public update" on public.students;
create policy "Allow public update" on public.students
  for update
  using (true);

-- Policy: Anyone can delete (for admin panel)
drop policy if exists "Allow public delete" on public.students;
create policy "Allow public delete" on public.students
  for delete
  using (client_id = '${CLIENT_ID}');
`

async function setupStudents() {
  const client = new Client({ connectionString: dbUrl })

  try {
    await client.connect()
    console.log('✅ Conectado ao banco. Criando tabela students em public...')

    await client.query(sql)
    console.log('✅ Tabela public.students criada com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao criar schema/tabela:', error)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

setupStudents()
