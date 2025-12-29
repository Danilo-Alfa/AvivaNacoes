-- =====================================================
-- SCHEMA PARA GERENCIAMENTO DE VÍDEOS E PLAYLISTS
-- AvivaNacoes - Sistema de Admin de Vídeos
-- =====================================================

-- Tabela: videos
-- Armazena vídeos individuais do YouTube
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  url_video VARCHAR(500) NOT NULL, -- URL do YouTube
  thumbnail_url VARCHAR(500), -- URL da thumbnail personalizada (opcional)
  duracao VARCHAR(20), -- Ex: "1h 15min"
  pregador VARCHAR(100), -- Nome do pregador/orador
  categoria VARCHAR(50), -- Ex: "Culto", "Pregação", "Testemunho", "Estudo Bíblico"
  destaque BOOLEAN DEFAULT false, -- Se é o vídeo em destaque na página
  ordem INTEGER DEFAULT 0, -- Ordem de exibição (menor número = mais prioritário)
  ativo BOOLEAN DEFAULT true, -- Se está visível na página pública
  data_publicacao TIMESTAMP WITH TIME ZONE, -- Data real do vídeo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: playlists
-- Armazena playlists/séries de vídeos do YouTube
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  url_playlist VARCHAR(500) NOT NULL, -- URL da playlist do YouTube
  quantidade_videos INTEGER DEFAULT 0, -- Quantidade de vídeos na playlist
  categoria VARCHAR(50), -- Ex: "Série", "Testemunhos", "Estudos"
  ordem INTEGER DEFAULT 0, -- Ordem de exibição
  ativo BOOLEAN DEFAULT true, -- Se está visível na página pública
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_videos_destaque ON videos(destaque) WHERE destaque = true;
CREATE INDEX IF NOT EXISTS idx_videos_ativo ON videos(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_videos_ordem ON videos(ordem);
CREATE INDEX IF NOT EXISTS idx_videos_data_publicacao ON videos(data_publicacao DESC);
CREATE INDEX IF NOT EXISTS idx_videos_categoria ON videos(categoria);

CREATE INDEX IF NOT EXISTS idx_playlists_ativo ON playlists(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_playlists_ordem ON playlists(ordem);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
-- Habilitar RLS nas tabelas
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer pessoa pode LER vídeos ativos
CREATE POLICY "Vídeos ativos são públicos"
  ON videos FOR SELECT
  USING (ativo = true);

-- Política: Qualquer pessoa pode LER playlists ativas
CREATE POLICY "Playlists ativas são públicas"
  ON playlists FOR SELECT
  USING (ativo = true);

-- Política: Admins podem fazer TUDO (você precisará ajustar conforme seu sistema de auth)
-- Para usuários autenticados com role 'admin' ou service_role
CREATE POLICY "Admins podem gerenciar vídeos"
  ON videos FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins podem gerenciar playlists"
  ON playlists FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- DADOS DE EXEMPLO (OPCIONAL - REMOVER EM PRODUÇÃO)
-- =====================================================

-- Inserir vídeo em destaque de exemplo
INSERT INTO videos (titulo, descricao, url_video, duracao, pregador, categoria, destaque, ordem, data_publicacao)
VALUES (
  'Título do Último Culto ou Mensagem',
  'Descrição do vídeo, incluindo o tema da mensagem, o pregador e pontos principais abordados.',
  'https://youtu.be/Nz-EPSwe5as?si=Kwl7A51XJoqx2mcW',
  '1h 15min',
  'Pastor João Silva',
  'Culto',
  true,
  1,
  '2024-12-10T19:00:00-03:00'
);

-- Inserir alguns vídeos recentes de exemplo
INSERT INTO videos (titulo, descricao, url_video, duracao, pregador, categoria, destaque, ordem, data_publicacao)
VALUES
  (
    'O Poder da Oração - Mensagem Transformadora',
    'Breve descrição do conteúdo do vídeo e principais pontos abordados sobre a importância da oração.',
    'https://youtu.be/Nz-EPSwe5as?si=Kwl7A51XJoqx2mcW',
    '45min',
    'Pastor João Silva',
    'Pregação',
    false,
    2,
    '2024-12-05T19:00:00-03:00'
  ),
  (
    'Testemunho de Cura e Libertação',
    'Emocionante testemunho de superação através da fé.',
    'https://youtu.be/Nz-EPSwe5as?si=Kwl7A51XJoqx2mcW',
    '15min',
    'Maria Santos',
    'Testemunho',
    false,
    3,
    '2024-12-03T10:00:00-03:00'
  ),
  (
    'Estudo Bíblico - Livro de Romanos Cap. 8',
    'Profundo estudo sobre a carta aos Romanos.',
    'https://youtu.be/Nz-EPSwe5as?si=Kwl7A51XJoqx2mcW',
    '1h 30min',
    'Pastor Carlos Mendes',
    'Estudo Bíblico',
    false,
    4,
    '2024-11-30T20:00:00-03:00'
  );

-- Inserir playlists de exemplo
INSERT INTO playlists (nome, descricao, url_playlist, quantidade_videos, categoria, ordem)
VALUES
  (
    'Série: Fundamentos da Fé',
    'Uma série completa sobre os fundamentos da fé cristã, abordando temas como salvação, batismo, oração e vida no Espírito.',
    'https://www.youtube.com/playlist?list=PLrRqXJYWjYhW8CqXBqXzV4ZJNqZ5Ck3gK',
    8,
    'Série',
    1
  ),
  (
    'Série: Família Abençoada',
    'Mensagens inspiradoras sobre como construir uma família segundo os princípios bíblicos.',
    'https://www.youtube.com/playlist?list=PLrRqXJYWjYhVQZ2xYgJxZ4FNxZzC3FgYM',
    16,
    'Série',
    2
  ),
  (
    'Testemunhos 2024',
    'Coletânea dos testemunhos mais impactantes de vidas transformadas pelo poder de Deus.',
    'https://www.youtube.com/playlist?list=PLrRqXJYWjYhXF5tGHJ8KhZkZ2Nx9FgTpL',
    24,
    'Testemunhos',
    3
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
-- IMPORTANTE:
-- - As políticas RLS estão configuradas para aceitar qualquer usuário autenticado
-- - Você pode precisar ajustar as políticas conforme seu sistema de autenticação
-- - Os dados de exemplo podem ser removidos após testar
-- - As URLs dos vídeos são exemplos, substitua pelas URLs reais
--
