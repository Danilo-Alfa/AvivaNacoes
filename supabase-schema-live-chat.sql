-- =====================================================
-- TABELA DE MENSAGENS DO CHAT DA LIVE
-- =====================================================
-- Armazena as mensagens enviadas durante a live

-- Tabela de mensagens do chat
CREATE TABLE IF NOT EXISTS live_chat_mensagens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL, -- ID da sessão do viewer
  nome VARCHAR(100) NOT NULL, -- Nome do usuário
  email VARCHAR(255), -- Email do usuário (opcional)
  mensagem TEXT NOT NULL, -- Conteúdo da mensagem
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_live_chat_created_at ON live_chat_mensagens(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_chat_session ON live_chat_mensagens(session_id);

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

ALTER TABLE live_chat_mensagens ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode enviar mensagens
CREATE POLICY "Permitir inserir mensagens" ON live_chat_mensagens
  FOR INSERT TO anon, authenticated WITH CHECK (TRUE);

-- Qualquer pessoa pode ler mensagens
CREATE POLICY "Permitir ler mensagens" ON live_chat_mensagens
  FOR SELECT TO anon, authenticated USING (TRUE);

-- Apenas service_role pode deletar mensagens (via servidor)
CREATE POLICY "Permitir deletar mensagens (service_role)" ON live_chat_mensagens
  FOR DELETE TO service_role USING (TRUE);

-- =====================================================
-- FUNÇÃO PARA LIMPAR MENSAGENS ANTIGAS
-- =====================================================
-- Remove mensagens com mais de 24 horas (opcional)

CREATE OR REPLACE FUNCTION limpar_mensagens_antigas()
RETURNS INTEGER AS $$
DECLARE
  mensagens_removidas INTEGER;
BEGIN
  DELETE FROM live_chat_mensagens
  WHERE created_at < NOW() - INTERVAL '24 hours';

  GET DIAGNOSTICS mensagens_removidas = ROW_COUNT;

  RETURN mensagens_removidas;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEW PARA ESTATÍSTICAS DO CHAT
-- =====================================================

CREATE OR REPLACE VIEW live_chat_stats AS
SELECT
  COUNT(*) AS total_mensagens,
  COUNT(DISTINCT session_id) AS usuarios_unicos,
  MIN(created_at) AS primeira_mensagem,
  MAX(created_at) AS ultima_mensagem
FROM live_chat_mensagens;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE live_chat_mensagens IS 'Mensagens do chat durante a transmissão ao vivo';
COMMENT ON COLUMN live_chat_mensagens.session_id IS 'ID da sessão do viewer que enviou a mensagem';
COMMENT ON COLUMN live_chat_mensagens.mensagem IS 'Conteúdo da mensagem (máx. 500 caracteres recomendado)';
COMMENT ON FUNCTION limpar_mensagens_antigas IS 'Remove mensagens com mais de 24 horas';
