import { createClient } from '@supabase/supabase-js';
import { COURSE_DATA } from '../courseData.ts';

const supabaseUrl = 'https://omnuydikeejhiahkufwa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbnV5ZGlrZWVqaGlhaGt1ZndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTE5NzgsImV4cCI6MjA4NjU4Nzk3OH0.J_O9zOPAEO3CukqooNE0Em0Jr-p_7v3sPsXzeGPprUg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCourses() {
  console.log('Migrando cursos para admin_courses...');
  const payload = COURSE_DATA.map(course => ({
    title: course.title,
    instructor: course.instructor,
    instagram: course.instagram,
    date: null, // ajuste se necessário
    price: course.price,
    category: course.category,
    description: course.description,
    capacity: 30, // valor padrão, ajuste se necessário
    created_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase.from('admin_courses').insert(payload);
  if (error) {
    console.error('Erro ao migrar cursos:', error.message);
  } else {
    console.log(`Cursos migrados com sucesso: ${data?.length ?? payload.length}`);
  }
}

migrateCourses();
