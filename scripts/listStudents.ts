import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config({ path: '.env.local', override: true })
dotenv.config({ override: true })

const { Client } = pg

const dbUrl = process.env.SUPABASE_DB_URL
const CLIENT_ID = '15d783c5-ad6c-4ee8-927b-eed0b828ad85'

if (!dbUrl) {
  console.error('❌ SUPABASE_DB_URL não encontrado')
  process.exit(1)
}

async function listStudents() {
  const client = new Client({ connectionString: dbUrl })

  try {
    await client.connect()
    console.log('✅ Conectado ao banco. Listando alunos...\n')

    const result = await client.query(`
      SELECT id, name, email, cpf, password, first_access, status, course, created_at
      FROM public.students
      WHERE client_id = $1
      ORDER BY created_at DESC
    `, [CLIENT_ID])

    if (result.rows.length === 0) {
      console.log('⚠️ Nenhum aluno encontrado.')
      return
    }

    console.log(`📊 Total de alunos: ${result.rows.length}\n`)
    console.log('='.repeat(120))

    result.rows.forEach((row, index) => {
      console.log(`\n[${index + 1}] ${row.name}`)
      console.log(`   E-mail: ${row.email}`)
      console.log(`   CPF: ${row.cpf || 'N/A'}`)
      console.log(`   Senha armazenada: ${row.password || 'N/A'}`)
      console.log(`   Primeiro acesso: ${row.first_access}`)
      console.log(`   Status: ${row.status}`)
      console.log(`   Curso: ${row.course || 'N/A'}`)
      console.log(`   Criado em: ${row.created_at}`)
    })

    console.log('\n' + '='.repeat(120))
  } catch (error) {
    console.error('❌ Erro:', error)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

listStudents()
