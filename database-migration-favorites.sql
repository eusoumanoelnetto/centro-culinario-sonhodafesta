-- Migration: Adicionar coluna favorites para salvar lista de desejos dos alunos
-- Execute este SQL no Supabase SQL Editor

-- Adicionar coluna favorites do tipo JSONB (array de strings)
ALTER TABLE students
ADD COLUMN IF NOT EXISTS favorites JSONB DEFAULT NULL;

-- Comentário explicativo
COMMENT ON COLUMN students.favorites IS 'Array de IDs de cursos favoritos do aluno (lista de desejos)';

-- Criar índice para melhor desempenho em buscas
CREATE INDEX IF NOT EXISTS idx_students_favorites ON students USING GIN (favorites);

-- Exemplo de uso:
-- UPDATE students SET favorites = '["course-1", "course-2", "course-3"]'::jsonb WHERE id = 'student-id';
