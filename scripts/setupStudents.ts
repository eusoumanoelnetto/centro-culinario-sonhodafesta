import dotenv from 'dotenv'
import pg from 'pg'

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

create table if not exists public.students (
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
  created_at timestamp with time zone default now()
);

create unique index if not exists students_client_email_idx
  on public.students (client_id, email);
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
