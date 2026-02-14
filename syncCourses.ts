import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { COURSE_DATA } from './courseData.ts'

dotenv.config({ override: true })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_ANON_KEY não encontrados. Verifique o .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

type CourseEntry = (typeof COURSE_DATA)[number]

function buildDescription(course: CourseEntry) {
  if (course.description) return course.description
  return `Workshop da categoria ${course.category}. Instrutor: ${course.instructor}.`
}

async function syncCourses() {
  console.log('🚀 Iniciando sincronização de cursos...')

  const { error: deleteError } = await supabase
    .from('courses')
    .delete()
    .neq('title', '')

  if (deleteError) {
    console.error('❌ Erro ao limpar tabela de cursos:', deleteError.message)
    process.exit(1)
  }

  console.log('🧹 Tabela limpa. Inserindo novos cursos...')

  const payload = COURSE_DATA.map(course => ({
    title: course.title,
    description: buildDescription(course),
    category: course.category,
    price: Number(course.price.toFixed(2)),
    image: course.image,
    rating: course.rating,
  }))

  const { data, error } = await supabase.from('courses').insert(payload)

  if (error) {
    console.error('❌ Erro ao inserir cursos:', error.message)
    process.exit(1)
  }

  console.log(`✅ ${data?.length ?? payload.length} cursos sincronizados com sucesso!`)
}

syncCourses()
