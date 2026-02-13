-- Tabela para armazenar mensagens do formulário Fale Conosco
CREATE TABLE mensagens_contato (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  assunto TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE mensagens_contato ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (formulário do site)
CREATE POLICY "Permitir inserção pública de mensagens"
  ON mensagens_contato
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política para leitura apenas por usuários autenticados (admin)
CREATE POLICY "Permitir leitura para autenticados"
  ON mensagens_contato
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para atualização apenas por usuários autenticados (marcar como lida)
CREATE POLICY "Permitir atualização para autenticados"
  ON mensagens_contato
  FOR UPDATE
  TO authenticated
  USING (true);

-- Política para deleção apenas por usuários autenticados
CREATE POLICY "Permitir deleção para autenticados"
  ON mensagens_contato
  FOR DELETE
  TO authenticated
  USING (true);
