import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config({ path: '.env.local', override: true })
dotenv.config({ override: true })

const { Client } = pg

const dbUrl = process.env.SUPABASE_DB_URL

if (!dbUrl) {
  console.error('❌ SUPABASE_DB_URL não encontrado. Adicione no .env.local')
  process.exit(1)
}

async function setupFormSubmissions() {
  const client = new Client({ connectionString: dbUrl })

  try {
    await client.connect()
    console.log('✅ Conectado ao banco. Criando tabela form_submissions...')

    // Criar tabela form_submissions
    await client.query(`
      drop table if exists public.form_submissions cascade;
      
      create table public.form_submissions (
        id uuid primary key default gen_random_uuid(),
        client_id uuid not null references public.clients(id) on delete cascade,
        form_type text not null check (form_type in ('contact', 'newsletter', 'ai_lead', 'teacher_application', 'checkout', 'certificate_request', 'user_login', 'admin_login', 'search', 'admin_record')),
        payload jsonb,
        created_at timestamp with time zone default now()
      );
      
      create index if not exists form_submissions_client_id_idx
        on public.form_submissions (client_id);
      
      create index if not exists form_submissions_form_type_idx
        on public.form_submissions (form_type);
      
      -- Enable Row Level Security
      alter table public.form_submissions enable row level security;
      
      -- Policy: Anyone can insert
      drop policy if exists "Allow public insert" on public.form_submissions;
      create policy "Allow public insert" on public.form_submissions
        for insert
        with check (true);
      
      -- Policy: Anyone can read
      drop policy if exists "Allow public select" on public.form_submissions;
      create policy "Allow public select" on public.form_submissions
        for select
        using (true);
    `)

    console.log('✅ Tabela public.form_submissions criada com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao criar tabela form_submissions:', error)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

setupFormSubmissions()
