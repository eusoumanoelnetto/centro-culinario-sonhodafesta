import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

console.log("SEED INICIADO")

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
)

async function seed() {
  console.log("Conectando ao Supabase...")

  const { data, error } = await supabase
    .from('courses')
    .select('*')

  if (error) {
    console.error("Erro:", error)
    return
  }

  console.log("Conexão OK ✅")
  console.log("Dados:", data)
}

seed()
