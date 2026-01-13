-- =====================================================
-- SCHEMA PARA PROGRAMAÇÃO, IGREJAS E PROJETOS
-- AvivaNacoes - Sistema Admin Completo
-- =====================================================

-- =====================================================
-- 1. TABELA: programacao (Horários de Cultos)
-- =====================================================

CREATE TABLE IF NOT EXISTS programacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL, -- Ex: "Culto de Domingo", "Estudo Bíblico"
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=Domingo, 1=Segunda, ..., 6=Sábado
  horario VARCHAR(10) NOT NULL, -- Ex: "19h30", "10h"
  local VARCHAR(255), -- Ex: "Sede Principal", "Todas as Sedes"
  descricao TEXT, -- Descrição adicional
  ordem INTEGER DEFAULT 0, -- Ordem de exibição no mesmo dia
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_programacao_dia ON programacao(dia_semana);
CREATE INDEX IF NOT EXISTS idx_programacao_ativo ON programacao(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_programacao_ordem ON programacao(dia_semana, ordem);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_programacao_timestamp
  BEFORE UPDATE ON programacao
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();

-- RLS
ALTER TABLE programacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Programação é pública para leitura"
  ON programacao FOR SELECT
  USING (ativo = true);

CREATE POLICY "Admins podem gerenciar programação"
  ON programacao FOR ALL
  USING (true)
  WITH CHECK (true);

-- Dados de exemplo
INSERT INTO programacao (titulo, dia_semana, horario, local, descricao, ordem, ativo) VALUES
  ('Reunião de Oração', 1, '19h30', 'Sede Principal', 'Reunião semanal de oração', 1, true),
  ('Estudo Bíblico', 3, '19h30', 'Todas as Sedes', 'Estudo aprofundado da Palavra', 1, true),
  ('Culto de Jovens', 4, '20h', 'Sede Central', 'Culto voltado para a juventude', 1, true),
  ('Ministério Infantil', 5, '15h', 'Sede Principal', 'Atividades para crianças', 1, true),
  ('Escola Dominical', 6, '09h', 'Todas as Sedes', 'Estudo bíblico por faixas etárias', 1, true),
  ('Culto Matinal', 6, '10h', 'Todas as Sedes', 'Culto de celebração da manhã', 2, true),
  ('Culto Vespertino', 6, '19h', 'Todas as Sedes', 'Culto de celebração da noite', 3, true);

-- =====================================================
-- 2. TABELA: igrejas (Sedes e Localizações)
-- =====================================================

CREATE TABLE IF NOT EXISTS igrejas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL, -- Ex: "Sede Central"
  bairro VARCHAR(255), -- Ex: "Jardim Esther"
  endereco VARCHAR(500) NOT NULL, -- Ex: "Rua Lucas Padilha, 7"
  cidade VARCHAR(255), -- Ex: "São Paulo - SP"
  cep VARCHAR(20), -- Ex: "05366-080"
  telefone VARCHAR(50), -- Ex: "(11) 99999-9999"
  whatsapp VARCHAR(50), -- Número do WhatsApp (opcional)
  horarios TEXT, -- Horários de funcionamento
  pastor VARCHAR(255), -- Nome do pastor responsável
  latitude DECIMAL(10, 8), -- Coordenada para o mapa
  longitude DECIMAL(11, 8), -- Coordenada para o mapa
  imagem_url VARCHAR(500), -- URL da foto da igreja
  ordem INTEGER DEFAULT 0, -- Ordem de exibição
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_igrejas_ativo ON igrejas(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_igrejas_ordem ON igrejas(ordem);

-- Trigger
CREATE TRIGGER update_igrejas_timestamp
  BEFORE UPDATE ON igrejas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();

-- RLS
ALTER TABLE igrejas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Igrejas são públicas para leitura"
  ON igrejas FOR SELECT
  USING (ativo = true);

CREATE POLICY "Admins podem gerenciar igrejas"
  ON igrejas FOR ALL
  USING (true)
  WITH CHECK (true);

-- Dados de exemplo
INSERT INTO igrejas (nome, bairro, endereco, cidade, cep, telefone, horarios, pastor, latitude, longitude, ordem, ativo) VALUES
  (
    'Sede Central',
    'Jardim Esther',
    'Rua Lucas Padilha, 7 – Jd Esther',
    'São Paulo - SP',
    '05366-080',
    '(11) 99999-9999',
    'Aberto todos os dias às 18h',
    '',
    -23.574401,
    -46.758482,
    1,
    true
  ),
  (
    'Sede Norte',
    'Prado Rangel',
    'Estr. Bela Vista, 512',
    'Embu das Artes - SP',
    '06805-120',
    '',
    'Aberto em Eventos',
    '',
    -23.5405,
    -46.6233,
    2,
    true
  ),
  (
    'Sede Sul',
    'Bairro Sul',
    'Rua Exemplo, 789',
    'São Paulo - SP',
    '00000-000',
    '(11) 77777-7777',
    'Domingo: 09h e 19h | Quarta: 19h30',
    'Pr. Carlos Oliveira',
    -23.5605,
    -46.6433,
    3,
    true
  );

-- =====================================================
-- 3. TABELA: projetos (Projetos Sociais)
-- =====================================================

CREATE TABLE IF NOT EXISTS projetos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL, -- Ex: "Projeto Vida Nova"
  descricao TEXT, -- Descrição detalhada
  categoria VARCHAR(100), -- Ex: "Projeto Social", "Evangelismo", "Educação"
  objetivo TEXT, -- Objetivo principal
  publico_alvo VARCHAR(255), -- Ex: "Famílias carentes", "Jovens"
  frequencia VARCHAR(255), -- Ex: "Semanal", "Mensal"
  como_participar TEXT, -- Informações de como participar ou doar
  imagem_url VARCHAR(500), -- URL da imagem principal
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_projetos_ativo ON projetos(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_projetos_ordem ON projetos(ordem);
CREATE INDEX IF NOT EXISTS idx_projetos_categoria ON projetos(categoria);

-- Trigger
CREATE TRIGGER update_projetos_timestamp
  BEFORE UPDATE ON projetos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();

-- RLS
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projetos são públicos para leitura"
  ON projetos FOR SELECT
  USING (ativo = true);

CREATE POLICY "Admins podem gerenciar projetos"
  ON projetos FOR ALL
  USING (true)
  WITH CHECK (true);

-- Dados de exemplo
INSERT INTO projetos (nome, descricao, categoria, objetivo, publico_alvo, frequencia, como_participar, ordem, ativo) VALUES
  (
    'Projeto Vida Nova',
    'Assistência a famílias em situação de vulnerabilidade social, oferecendo cestas básicas, roupas e apoio espiritual.',
    'Projeto Social',
    'Proporcionar dignidade e esperança às famílias necessitadas',
    'Famílias carentes da região',
    'Entregas mensais',
    'Você pode doar alimentos, roupas ou contribuir financeiramente. Entre em contato pelo telefone da igreja.',
    1,
    true
  ),
  (
    'Escola Bíblica Infantil',
    'Ensino bíblico para crianças de 4 a 12 anos, com atividades lúdicas, música e teatro.',
    'Educação',
    'Ensinar os princípios bíblicos para a nova geração',
    'Crianças de 4 a 12 anos',
    'Todos os domingos às 9h',
    'Traga suas crianças! Professores voluntários também são bem-vindos.',
    2,
    true
  ),
  (
    'Grupo de Apoio',
    'Reuniões semanais para pessoas que precisam de apoio emocional e espiritual em momentos difíceis.',
    'Apoio Emocional',
    'Oferecer suporte e acolhimento em momentos de dificuldade',
    'Pessoas passando por dificuldades',
    'Quartas-feiras às 15h',
    'Participe das reuniões ou indique alguém que precisa de apoio.',
    3,
    true
  ),
  (
    'Evangelismo nas Ruas',
    'Ações de evangelismo em praças, hospitais e comunidades, levando a mensagem de esperança.',
    'Evangelismo',
    'Levar a palavra de Deus a quem ainda não conhece',
    'Toda a comunidade',
    'Sábados alternados',
    'Junte-se à equipe de evangelismo. Treinamento disponível para novos voluntários.',
    4,
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
-- 5. As 3 tabelas serão criadas com dados de exemplo
--
-- TABELAS CRIADAS:
-- - programacao: Horários de cultos e atividades semanais
-- - igrejas: Sedes da igreja com localização no mapa
-- - projetos: Projetos sociais e iniciativas
--
-- OBSERVAÇÕES:
-- - dia_semana: 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
-- - Todas as tabelas têm campo "ativo" para ocultar itens sem deletar
-- - Todas as tabelas têm campo "ordem" para controlar exibição
--
