-- =====================================================
-- SCHEMA PARA GERENCIAMENTO DE TRANSMISSÃO AO VIVO
-- AvivaNacoes - Sistema de Admin de Live
-- =====================================================

-- Tabela: live_config
-- Armazena as configurações da transmissão ao vivo
-- SEMPRE terá apenas 1 registro (single row table)
CREATE TABLE IF NOT EXISTS live_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Configurações da transmissão
  ativa BOOLEAN DEFAULT false, -- Se a live está ativa
  url_stream VARCHAR(500), -- URL do stream (HLS, RTMP, YouTube embed, etc)
  titulo VARCHAR(255) DEFAULT 'Transmissão ao Vivo', -- Título da live
  descricao TEXT, -- Descrição da live atual
  mensagem_offline TEXT DEFAULT 'Nenhuma transmissão ao vivo no momento', -- Mensagem quando offline

  -- Próxima live agendada (opcional)
  proxima_live_titulo VARCHAR(255), -- Ex: "Culto de Domingo"
  proxima_live_data TIMESTAMP WITH TIME ZONE, -- Data/hora da próxima live
  proxima_live_descricao TEXT, -- Descrição do evento

  -- Configurações visuais
  mostrar_contador_viewers BOOLEAN DEFAULT true, -- Mostrar contador de viewers
  cor_badge VARCHAR(20) DEFAULT '#ef4444', -- Cor do badge "AO VIVO"

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint: apenas 1 registro permitido
  CONSTRAINT single_row CHECK (id = 'c0000000-0000-0000-0000-000000000001'::uuid)
);

-- Garantir que só existe 1 registro
CREATE UNIQUE INDEX IF NOT EXISTS single_live_config ON live_config ((true));

-- Inserir o único registro de configuração
INSERT INTO live_config (
  id,
  ativa,
  url_stream,
  titulo,
  descricao,
  mensagem_offline,
  proxima_live_titulo,
  proxima_live_data,
  proxima_live_descricao
)
VALUES (
  'c0000000-0000-0000-0000-000000000001'::uuid,
  false,
  'https://seu-servidor.com/live/stream.m3u8',
  'Transmissão ao Vivo - Aviva NaçõesNações',
  'Assista aos cultos e eventos ao vivo',
  'Nenhuma transmissão ao vivo no momento. Fique atento aos nossos horários de culto e eventos especiais!',
  'Culto de Domingo',
  NOW() + INTERVAL '1 day',
  'Culto de Celebração - 10:00h'
)
ON CONFLICT (id) DO NOTHING;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_live_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_live_config_timestamp
  BEFORE UPDATE ON live_config
  FOR EACH ROW
  EXECUTE FUNCTION update_live_config_updated_at();

-- Políticas RLS (Row Level Security)
ALTER TABLE live_config ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer pessoa pode LER as configurações
CREATE POLICY "Configurações da live são públicas"
  ON live_config FOR SELECT
  USING (true);

-- Política: Apenas admins autenticados podem ATUALIZAR
-- (você precisará ajustar conforme seu sistema de autenticação)
CREATE POLICY "Admins podem atualizar configurações da live"
  ON live_config FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- TABELA AUXILIAR: live_schedule (OPCIONAL)
-- Para agendar múltiplas lives futuras
-- =====================================================

CREATE TABLE IF NOT EXISTS live_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE,
  url_stream VARCHAR(500), -- Se for diferente da URL padrão
  ativa BOOLEAN DEFAULT true, -- Se o agendamento está ativo
  notificar_usuarios BOOLEAN DEFAULT false, -- Se deve enviar notificação (futuro)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_live_schedule_data_inicio ON live_schedule(data_inicio);
CREATE INDEX IF NOT EXISTS idx_live_schedule_ativa ON live_schedule(ativa) WHERE ativa = true;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_live_schedule_timestamp
  BEFORE UPDATE ON live_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_live_config_updated_at();

-- RLS para live_schedule
ALTER TABLE live_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agendamentos de live são públicos"
  ON live_schedule FOR SELECT
  USING (ativa = true AND data_inicio >= NOW());

CREATE POLICY "Admins podem gerenciar agendamentos"
  ON live_schedule FOR ALL
  USING (true)
  WITH CHECK (true);

-- Inserir alguns agendamentos de exemplo
INSERT INTO live_schedule (titulo, descricao, data_inicio, data_fim, ativa)
VALUES
  (
    'Culto de Domingo - Manhã',
    'Culto de Celebração com a Pr. Maria Silva',
    DATE_TRUNC('week', NOW()) + INTERVAL '6 days' + INTERVAL '10 hours',
    DATE_TRUNC('week', NOW()) + INTERVAL '6 days' + INTERVAL '12 hours',
    true
  ),
  (
    'Culto de Domingo - Noite',
    'Culto da Família',
    DATE_TRUNC('week', NOW()) + INTERVAL '6 days' + INTERVAL '18 hours',
    DATE_TRUNC('week', NOW()) + INTERVAL '6 days' + INTERVAL '20 hours',
    true
  ),
  (
    'Culto de Quarta-feira',
    'Culto de Doutrina',
    DATE_TRUNC('week', NOW()) + INTERVAL '2 days' + INTERVAL '19 hours 30 minutes',
    DATE_TRUNC('week', NOW()) + INTERVAL '2 days' + INTERVAL '21 hours',
    true
  );

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================
--
-- COMO USAR:
-- 1. Copie todo este SQL
-- 2. Acesse seu projeto no Supabase (https://supabase.com)
-- 3. Vá em "SQL Editor" no menu lateral
-- 4. Cole o código e clique em "Run"
-- 5. As tabelas serão criadas com dados de exemplo
--
-- TABELA PRINCIPAL: live_config
-- - Sempre terá apenas 1 registro
-- - Use UPDATE, nunca INSERT (exceto o primeiro registro)
-- - Campo "ativa" controla se a live está no ar
--
-- TABELA OPCIONAL: live_schedule
-- - Armazena múltiplas lives agendadas
-- - Útil para mostrar "Próximas Transmissões"
-- - Pode ser expandida no futuro
--
-- IMPORTANTE:
-- - O ID da live_config é fixo: c0000000-0000-0000-0000-000000000001
-- - Isso garante que sempre haverá apenas 1 configuração
-- - Para atualizar, use: UPDATE live_config SET ativa = true WHERE id = 'c0000000-0000-0000-0000-000000000001'
--
