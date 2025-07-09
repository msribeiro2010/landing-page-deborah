-- Script de configuração completa para o projeto Deborah Vintage
-- Execute este script no SQL Editor do Supabase

-- 1. Criar a tabela images
CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar a função RPC get_all_images
CREATE OR REPLACE FUNCTION get_all_images()
RETURNS TABLE (
    id INTEGER,
    section VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
AS $$
    SELECT id, section, title, description, image_url, created_at
    FROM images
    ORDER BY created_at DESC;
$$;

-- 3. Habilitar RLS na tabela images
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas para a tabela images

-- Política para leitura pública (qualquer um pode ver as imagens)
CREATE POLICY "Permitir leitura pública de imagens" ON images
    FOR SELECT USING (true);

-- Política para inserção apenas por usuários autenticados
CREATE POLICY "Permitir inserção para usuários autenticados" ON images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para exclusão apenas por usuários autenticados
CREATE POLICY "Permitir exclusão para usuários autenticados" ON images
    FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Criar políticas para o storage bucket 'photos'
-- IMPORTANTE: Você ainda precisa criar o bucket 'photos' manualmente no painel Storage

-- Política para leitura pública de fotos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para leitura pública
CREATE POLICY "Permitir leitura pública de fotos" ON storage.objects
    FOR SELECT USING (bucket_id = 'photos');

-- Política para upload apenas por usuários autenticados
CREATE POLICY "Permitir upload para usuários autenticados" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- Política para exclusão apenas por usuários autenticados
CREATE POLICY "Permitir exclusão para usuários autenticados" ON storage.objects
    FOR DELETE USING (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- 6. Inserir dados de exemplo (opcional)
-- Descomente as linhas abaixo se quiser inserir algumas imagens de exemplo

/*
INSERT INTO images (section, title, description, image_url) VALUES
('Topo', 'Imagem Principal', 'Imagem de fundo da seção hero', 'https://via.placeholder.com/1200x600/00796b/ffffff?text=Massoterapia'),
('Sobre Mim', 'Foto Perfil', 'Foto da Deborah', 'https://via.placeholder.com/300x300/00796b/ffffff?text=Deborah'),
('Serviços', 'Massagem Relaxante', 'Técnica para alívio do estresse', 'https://via.placeholder.com/400x300/00796b/ffffff?text=Relaxante'),
('Serviços', 'Massagem Terapêutica', 'Tratamento para dores musculares', 'https://via.placeholder.com/400x300/00796b/ffffff?text=Terapêutica'),
('Serviços', 'Drenagem Linfática', 'Estimula a circulação linfática', 'https://via.placeholder.com/400x300/00796b/ffffff?text=Drenagem');
*/

-- Verificar se tudo foi criado corretamente
SELECT 'Tabela images criada' as status;
SELECT 'Função get_all_images criada' as status;
SELECT 'Políticas configuradas' as status;

-- Para verificar se as políticas foram criadas:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'images';

-- Para verificar se a função foi criada:
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'get_all_images';