# 🚀 Instruções de Configuração - Projeto Deborah Vintage

## ✅ O que já está funcionando:
- ✅ Frontend completo (HTML, CSS, JavaScript)
- ✅ Integração com Supabase configurada
- ✅ Sistema de login/logout
- ✅ Interface de upload de imagens
- ✅ Galeria administrativa

## ❌ O que precisa ser configurado no Supabase:

### 1. Executar o Script SQL

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para **SQL Editor** no menu lateral
3. Clique em **New Query**
4. Copie todo o conteúdo do arquivo `setup_supabase.sql`
5. Cole no editor e clique em **Run**

### 2. Criar Usuário Administrador

**Opção A - Pelo Dashboard:**
1. Vá para **Authentication** > **Users**
2. Clique em **Add user**
3. Preencha:
   - Email: `admin@deborahvintage.com` (ou o email que preferir)
   - Password: `admin123` (ou a senha que preferir)
   - Confirm password: (repita a senha)
4. Clique em **Create user**

**Opção B - Por SQL:**
```sql
-- Execute no SQL Editor
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@deborahvintage.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    ''
);
```

### 3. Verificar se tudo funcionou

1. **Teste o banco de dados:**
   ```sql
   -- Execute no SQL Editor para verificar
   SELECT * FROM get_all_images();
   ```

2. **Teste o login:**
   - Abra o arquivo `login.html` no navegador
   - Use o email e senha do usuário criado
   - Deve redirecionar para `admin.html`

3. **Teste o upload:**
   - Na página admin, tente fazer upload de uma imagem
   - Verifique se aparece na galeria
   - Verifique se aparece na página principal

## 🔧 Como testar o projeto:

### Método 1 - Servidor Local Simples
```bash
# No terminal, dentro da pasta do projeto:
python3 -m http.server 8000
# Ou se tiver Python 2:
python -m SimpleHTTPServer 8000

# Depois acesse: http://localhost:8000
```

### Método 2 - Live Server (VS Code)
1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

## 📋 Checklist de Verificação:

- [ ] Script SQL executado sem erros
- [ ] Bucket `photos` criado e público
- [ ] Usuário administrador criado
- [ ] Login funcionando (redireciona para admin.html)
- [ ] Upload de imagem funcionando
- [ ] Imagens aparecem na galeria admin
- [ ] Imagens aparecem na página principal
- [ ] Exclusão de imagens funcionando
- [ ] Logout funcionando

## 🐛 Problemas Comuns:

### "RPC function not found"
- Verifique se executou o script SQL completamente
- Confirme que a função `get_all_images` foi criada

### "Storage bucket not found"
- Vá para Storage > Buckets
- Crie um bucket chamado `photos`
- Marque como público

### "Authentication failed"
- Verifique se o usuário foi criado corretamente
- Confirme email e senha
- Verifique se o email foi confirmado

### "Permission denied"
- Verifique se as políticas RLS foram criadas
- Confirme que o bucket tem as políticas corretas

## 📞 Dados de Acesso Padrão:

**Email:** admin@deborahvintage.com  
**Senha:** admin123

> ⚠️ **IMPORTANTE:** Altere estes dados após o primeiro login!

## 🎯 Próximos Passos:

1. Configure o projeto no Supabase seguindo estas instruções
2. Teste todas as funcionalidades
3. Faça upload das imagens reais da Deborah
4. Personalize textos e informações
5. Configure domínio personalizado (opcional)

---

**Precisa de ajuda?** Verifique os logs do console do navegador (F12) para identificar erros específicos.