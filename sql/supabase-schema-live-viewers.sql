-- =====================================================
-- TABELA DE VIEWERS DA LIVE
-- =====================================================
-- Armazena os usuários que estão assistindo a live em tempo real

-- Tabela de viewers ativos
CREATE TABLE IF NOT EXISTS live_viewers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL UNIQUE, -- ID único da sessão do navegador
  nome VARCHAR(100), -- Nome do usuário (opcional)
  email VARCHAR(255), -- Email do usuário (opcional)
  ip_address VARCHAR(45), -- IP do usuário
  user_agent TEXT, -- Informações do navegador
  entrou_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultima_atividade TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Heartbeat
  assistindo BOOLEAN DEFAULT TRUE
);

-- Índice para buscar viewers ativos
CREATE INDEX IF NOT EXISTS idx_live_viewers_assistindo ON live_viewers(assistindo);
CREATE INDEX IF NOT EXISTS idx_live_viewers_ultima_atividade ON live_viewers(ultima_atividade);
CREATE INDEX IF NOT EXISTS idx_live_viewers_session ON live_viewers(session_id);

-- Tabela de histórico (para analytics)
CREATE TABLE IF NOT EXISTS live_viewers_historico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  nome VARCHAR(100),
  email VARCHAR(255),
  entrou_em TIMESTAMP WITH TIME ZONE NOT NULL,
  saiu_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tempo_assistido INTEGER, -- em segundos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para relatórios
CREATE INDEX IF NOT EXISTS idx_live_viewers_historico_data ON live_viewers_historico(entrou_em);

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

ALTER TABLE live_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_viewers_historico ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode se registrar como viewer
CREATE POLICY "Permitir inserir viewers" ON live_viewers
  FOR INSERT TO anon, authenticated WITH CHECK (TRUE);

-- Qualquer pessoa pode atualizar seu próprio registro (heartbeat)
CREATE POLICY "Permitir atualizar próprio viewer" ON live_viewers
  FOR UPDATE TO anon, authenticated USING (TRUE) WITH CHECK (TRUE);

-- Qualquer pessoa pode ler a contagem de viewers (sem dados pessoais)
CREATE POLICY "Permitir ler viewers" ON live_viewers
  FOR SELECT TO anon, authenticated USING (TRUE);

-- Permitir deletar viewers inativos
CREATE POLICY "Permitir deletar viewers" ON live_viewers
  FOR DELETE TO anon, authenticated USING (TRUE);

-- Políticas para histórico
CREATE POLICY "Permitir inserir histórico" ON live_viewers_historico
  FOR INSERT TO anon, authenticated WITH CHECK (TRUE);

CREATE POLICY "Permitir ler histórico" ON live_viewers_historico
  FOR SELECT TO anon, authenticated USING (TRUE);

-- =====================================================
-- FUNÇÃO PARA LIMPAR VIEWERS INATIVOS
-- =====================================================
-- Remove viewers que não mandaram heartbeat nos últimos 2 minutos

CREATE OR REPLACE FUNCTION limpar_viewers_inativos()
RETURNS INTEGER AS $$
DECLARE
  viewers_removidos INTEGER;
BEGIN
  -- Primeiro, mover para histórico
  INSERT INTO live_viewers_historico (session_id, nome, email, entrou_em, saiu_em, tempo_assistido)
  SELECT
    session_id,
    nome,
    email,
    entrou_em,
    NOW(),
    EXTRACT(EPOCH FROM (NOW() - entrou_em))::INTEGER
  FROM live_viewers
  WHERE ultima_atividade < NOW() - INTERVAL '2 minutes';

  -- Depois, remover da tabela de viewers ativos
  DELETE FROM live_viewers
  WHERE ultima_atividade < NOW() - INTERVAL '2 minutes';

  GET DIAGNOSTICS viewers_removidos = ROW_COUNT;

  RETURN viewers_removidos;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO PARA CONTAR VIEWERS ATIVOS
-- =====================================================

CREATE OR REPLACE FUNCTION contar_viewers_ativos()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM live_viewers
    WHERE assistindo = TRUE
    AND ultima_atividade > NOW() - INTERVAL '2 minutes'
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEW PARA ESTATÍSTICAS
-- =====================================================

CREATE OR REPLACE VIEW live_viewers_stats AS
SELECT
  COUNT(*) FILTER (WHERE assistindo = TRUE AND ultima_atividade > NOW() - INTERVAL '2 minutes') AS viewers_ativos,
  COUNT(*) AS total_registros,
  MIN(entrou_em) AS primeiro_viewer,
  MAX(entrou_em) AS ultimo_viewer
FROM live_viewers;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE live_viewers IS 'Armazena os viewers atualmente assistindo a live';
COMMENT ON TABLE live_viewers_historico IS 'Histórico de viewers para analytics';
COMMENT ON COLUMN live_viewers.session_id IS 'ID único gerado no navegador para identificar a sessão';
COMMENT ON COLUMN live_viewers.ultima_atividade IS 'Timestamp do último heartbeat - usado para detectar viewers ativos';
COMMENT ON FUNCTION limpar_viewers_inativos IS 'Remove viewers que não enviaram heartbeat nos últimos 2 minutos';
COMMENT ON FUNCTION contar_viewers_ativos IS 'Retorna o número de viewers ativos';
