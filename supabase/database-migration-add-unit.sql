-- Adiciona a coluna 'unit' na tabela 'courses'
ALTER TABLE courses
ADD COLUMN unit TEXT;

-- Adiciona a coluna 'unit' na tabela 'admin_courses'
ALTER TABLE admin_courses
ADD COLUMN unit TEXT;