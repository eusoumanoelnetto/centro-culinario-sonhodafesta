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

const CLIENT_ID = '15d783c5-ad6c-4ee8-927b-eed0b828ad85'
const CLIENT_NAME = 'Centro Culinário Sonho da Festa'

const sql = `
-- Criar tabela clients se não existir
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

-- Inserir ou atualizar o cliente principal
insert into public.clients (id, name)
values ($1, $2)
on conflict (id) do update set name = $2;
`

async function setupClient() {
  const client = new Client({ connectionString: dbUrl })

  try {
    await client.connect()
    console.log('✅ Conectado ao banco. Verificando/criando cliente...')

    await client.query(sql, [CLIENT_ID, CLIENT_NAME])
    console.log(`✅ Cliente "${CLIENT_NAME}" configurado com sucesso!`)
    console.log(`   ID: ${CLIENT_ID}`)
  } catch (error) {
    console.error('❌ Erro ao configurar cliente:', error)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

setupClient()
