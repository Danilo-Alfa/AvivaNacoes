# Deploy da Edge Function - create-user

## Pre-requisitos

1. Instalar Supabase CLI:
```bash
npm install -g supabase
```

2. Fazer login no Supabase:
```bash
supabase login
```

## Deploy da Function

1. Navegue ate a pasta do projeto escola-aviva:
```bash
cd sites/escola-aviva
```

2. Linke o projeto ao seu Supabase (so precisa fazer uma vez):
```bash
supabase link --project-ref bmfhlfyriudhkjnibayv
```
> Quando pedir a senha do banco, use: `tartaruga10`

3. Faca o deploy da function:
```bash
supabase functions deploy create-user
```

## Alternativa: Deploy pelo Dashboard

Se preferir nao usar CLI, voce pode criar a function pelo Dashboard:

1. Acesse: https://supabase.com/dashboard/project/bmfhlfyriudhkjnibayv/functions
2. Clique em "Create a new function"
3. Nome: `create-user`
4. Cole o codigo do arquivo `functions/create-user/index.ts`
5. Clique em "Deploy"

## Testando

Apos o deploy, acesse o painel Admin do site e clique em "Novo Usuario".

## Troubleshooting

### Erro de CORS
A function ja inclui headers CORS. Se ainda der erro, verifique se a URL do Supabase esta correta no `.env`.

### Erro "Nao autorizado"
Certifique-se de estar logado como admin antes de tentar criar usuarios.

### Erro ao conectar
Verifique se o projeto esta linkado corretamente:
```bash
supabase status
```
