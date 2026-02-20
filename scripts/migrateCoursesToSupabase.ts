import { createClient } from '@supabase/supabase-js';
import { COURSE_DATA } from '../courseData.ts';

// Função para converter datas tipo '02 Fev' para '2026-02-02'
function parseDate(dateStr: string, year = 2026): string | null {
  if (!dateStr) return null;
  const meses = {
    'Jan': '01', 'Fev': '02', 'Mar': '03', 'Abr': '04', 'Mai': '05', 'Jun': '06',
    'Jul': '07', 'Ago': '08', 'Set': '09', 'Out': '10', 'Nov': '11', 'Dez': '12'
  };
  const [dia, mesAbrev] = dateStr.split(' ');
  const mes = meses[mesAbrev];
  if (!mes) return null;
  return `${year}-${mes}-${dia.padStart(2, '0')}`;
}

const supabaseUrl = 'https://omnuydikeejhiahkufwa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbnV5ZGlrZWVqaGlhaGt1ZndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTE5NzgsImV4cCI6MjA4NjU4Nzk3OH0.J_O9zOPAEO3CukqooNE0Em0Jr-p_7v3sPsXzeGPprUg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCourses() {
  console.log('Migrando cursos para admin_courses...');
  const payload = COURSE_DATA.map(course => {
    const parsedDate = parseDate(course.date);
    console.log(`ID: ${course.id} | Título: ${course.title} | Original: ${course.date} | Convertido: ${parsedDate}`);
    return {
      title: course.title,
      instructor: course.instructor,
      instagram: course.instagram,
      date: parsedDate,
      price: course.price,
      category: course.category,
      description: course.description,
      capacity: 30, // valor padrão, ajuste se necessário
      created_at: new Date().toISOString(),
      unit: course.unit
    };
  });

  // Removido segundo mapeamento desnecessário do payload

  // Limpa as tabelas antes de inserir (opcional, remova se não quiser sobrescrever)
  await supabase.from('admin_courses').delete().neq('title', '');
  await supabase.from('courses').delete().neq('title', '');

  // Insere em admin_courses
  const { error: errorAdmin } = await supabase.from('admin_courses').insert(payload);
  if (errorAdmin) {
    console.error('Erro ao migrar cursos para admin_courses:', errorAdmin.message);
  } else {
    console.log(`Cursos migrados com sucesso para admin_courses: ${payload.length}`);
  }

  // Insere em courses
  const { error: errorCourses } = await supabase.from('courses').insert(payload);
  if (errorCourses) {
    console.error('Erro ao migrar cursos para courses:', errorCourses.message);
  } else {
    console.log(`Cursos migrados com sucesso para courses: ${payload.length}`);
  }
}

migrateCourses();
