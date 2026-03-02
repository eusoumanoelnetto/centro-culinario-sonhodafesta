-- Adicionar colunas faltantes à tabela admin_blog_posts
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna image_url para armazenar a URL da imagem de capa
ALTER TABLE admin_blog_posts 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Adicionar coluna excerpt para o resumo/preview do post
ALTER TABLE admin_blog_posts 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Habilitar Row Level Security (se ainda não estiver)
ALTER TABLE admin_blog_posts ENABLE ROW LEVEL SECURITY;

-- Criar política de leitura pública para posts do blog
DROP POLICY IF EXISTS "Leitura pública de posts do blog" ON admin_blog_posts;
CREATE POLICY "Leitura pública de posts do blog"
ON admin_blog_posts FOR SELECT
USING (true);

-- Verificar a estrutura atualizada
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'admin_blog_posts';
