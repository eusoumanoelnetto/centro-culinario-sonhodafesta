import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { CLIENTS_DATA } from './clientData.ts'

dotenv.config({ override: true })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_ANON_KEY não encontrados. Verifique o .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function syncClients() {
  console.log('🚀 Iniciando sincronização de clientes...')

  const { error: deleteError } = await supabase
    .from('clients')
    .delete()
    .not('id', 'is', null)

  if (deleteError) {
    console.error('❌ Erro ao limpar clientes:', deleteError.message)
    process.exit(1)
  }

  console.log('🧹 Tabela de clientes limpa.')

  if (CLIENTS_DATA.length === 0) {
    console.log('ℹ️ Nenhum cliente para inserir. Tabela permanecerá vazia.')
    return
  }

  const { data, error } = await supabase.from('clients').insert(CLIENTS_DATA)

  if (error) {
    console.error('❌ Erro ao inserir clientes:', error.message)
    process.exit(1)
  }

  console.log(`✅ ${data?.length ?? CLIENTS_DATA.length} cliente(s) sincronizado(s) com sucesso!`)
}

syncClients()
