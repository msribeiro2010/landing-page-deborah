# Configuração Necessária no Supabase

Para que o projeto funcione completamente, você precisa configurar os seguintes itens no seu projeto Supabase:

## 1. Tabela `images`

Crie uma tabela chamada `images` com as seguintes colunas:

```sql
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 2. Storage Bucket

Crie um bucket de storage chamado `photos`:

1. Vá para Storage no painel do Supabase
2. Clique em "New bucket"
3. Nome: `photos`
4. Marque como "Public bucket" para permitir acesso público às imagens

## 3. Função RPC `get_all_images`

Crie uma função RPC para buscar todas as imagens:

```sql
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
```

## 4. Políticas de Segurança (RLS)

### Para a tabela `images`:

```sql
-- Habilitar RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (qualquer um pode ver as imagens)
CREATE POLICY "Permitir leitura pública de imagens" ON images
    FOR SELECT USING (true);

-- Política para inserção apenas por usuários autenticados
CREATE POLICY "Permitir inserção para usuários autenticados" ON images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para exclusão apenas por usuários autenticados
CREATE POLICY "Permitir exclusão para usuários autenticados" ON images
    FOR DELETE USING (auth.role() = 'authenticated');
```

### Para o storage bucket `photos`:

```sql
-- Política para leitura pública
CREATE POLICY "Permitir leitura pública de fotos" ON storage.objects
    FOR SELECT USING (bucket_id = 'photos');

-- Política para upload apenas por usuários autenticados
CREATE POLICY "Permitir upload para usuários autenticados" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- Política para exclusão apenas por usuários autenticados
CREATE POLICY "Permitir exclusão para usuários autenticados" ON storage.objects
    FOR DELETE USING (bucket_id = 'photos' AND auth.role() = 'authenticated');
```

## 5. Criar Usuário Administrador

Para criar um usuário administrador:

1. Vá para Authentication > Users no painel do Supabase
2. Clique em "Add user"
3. Adicione um email e senha para o administrador
4. Ou use o SQL Editor para criar:

```sql
-- Substitua 'admin@exemplo.com' e 'senha123' pelos valores desejados
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'admin@exemplo.com',
    crypt('senha123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);
```

## 6. Verificar Configurações

Após configurar tudo:

1. Teste o login com o usuário criado
2. Teste o upload de uma imagem
3. Verifique se a imagem aparece na página principal
4. Teste a exclusão de imagens

## Problemas Comuns

- **Erro de CORS**: Certifique-se de que o domínio está configurado nas configurações do projeto
- **Erro de autenticação**: Verifique se as políticas RLS estão corretas
- **Imagens não carregam**: Verifique se o bucket está público e as políticas de storage estão corretas
- **Função RPC não encontrada**: Certifique-se de que a função `get_all_images` foi criada corretamente

## Status Atual

✅ Frontend completo
✅ Integração com Supabase configurada
❌ Tabela `images` (precisa ser criada)
❌ Bucket `photos` (precisa ser criado)
❌ Função RPC `get_all_images` (precisa ser criada)
❌ Políticas de segurança (precisam ser configuradas)
❌ Usuário administrador (precisa ser criado)