import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ override: true })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_ANON_KEY não encontrados. Verifique o .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function listClients() {
  console.log('🔎 Buscando clientes cadastrados...')

  const { data, error } = await supabase.from('clients').select('*')

  if (error) {
    console.error('❌ Erro ao consultar clientes:', error.message)
    process.exit(1)
  }

  console.log(`Encontrados ${data.length} registros.`)
  console.dir(data, { depth: null })
}

listClients()
