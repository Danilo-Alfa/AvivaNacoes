-- Script para criar a funcao RPC de verificacao de senha admin no Supabase
-- Executar no SQL Editor do Supabase Dashboard
--
-- IMPORTANTE: Substituir 'SUA_SENHA_ADMIN_AQUI' pela senha desejada
-- A senha fica armazenada server-side, nunca exposta no bundle JS

-- 1. Criar a funcao RPC
CREATE OR REPLACE FUNCTION verify_admin_password(password_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  -- Buscar o hash da senha admin na tabela de configuracoes
  SELECT value INTO stored_hash
  FROM app_config
  WHERE key = 'admin_password_hash';

  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Comparar usando crypt (pgcrypto)
  RETURN stored_hash = crypt(password_input, stored_hash);
END;
$$;

-- 2. Criar tabela de configuracoes (se nao existir)
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Habilitar extensao pgcrypto (se nao estiver habilitada)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 4. Inserir a senha admin (hash bcrypt)
-- IMPORTANTE: Substituir 'SUA_SENHA_ADMIN_AQUI' pela senha desejada
INSERT INTO app_config (key, value)
VALUES ('admin_password_hash', crypt('SUA_SENHA_ADMIN_AQUI', gen_salt('bf')))
ON CONFLICT (key)
DO UPDATE SET value = crypt('SUA_SENHA_ADMIN_AQUI', gen_salt('bf')), updated_at = now();

-- 5. Proteger a tabela com RLS
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Nenhuma policy = ninguem le a tabela diretamente
-- A funcao RPC usa SECURITY DEFINER para acessar

-- 6. Permitir chamada RPC pela anon key
GRANT EXECUTE ON FUNCTION verify_admin_password(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_admin_password(TEXT) TO authenticated;
