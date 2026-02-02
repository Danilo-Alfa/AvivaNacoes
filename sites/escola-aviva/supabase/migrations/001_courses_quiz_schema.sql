-- ============================================
-- Schema: Cursos, Aulas e Sistema de Quiz
-- ============================================

-- Cursos (substitui o arquivo estático)
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  descricao_completa TEXT,
  thumbnail_url VARCHAR(500),
  instrutor VARCHAR(150),
  duracao_total VARCHAR(50),
  nivel VARCHAR(50) CHECK (nivel IN ('Iniciante', 'Intermediário', 'Avançado')),
  is_novo BOOLEAN DEFAULT false,
  is_ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aulas (vinculadas aos cursos)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  video_id VARCHAR(50) NOT NULL,
  duracao VARCHAR(20),
  ordem INTEGER NOT NULL,
  has_quiz BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Perguntas do Quiz
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  texto_pergunta TEXT NOT NULL,
  explicacao TEXT,
  ordem INTEGER DEFAULT 0
);

-- Opções de Resposta
CREATE TABLE IF NOT EXISTS question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  texto_opcao TEXT NOT NULL,
  is_correta BOOLEAN DEFAULT false,
  ordem INTEGER DEFAULT 0
);

-- Progresso do Aluno nas Aulas
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Respostas do Aluno nos Quizzes
CREATE TABLE IF NOT EXISTS user_question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES question_options(id),
  is_correct BOOLEAN,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- ============================================
-- Índices para Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_ordem ON lessons(course_id, ordem);
CREATE INDEX IF NOT EXISTS idx_questions_lesson_id ON questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_course ON user_lesson_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_question_responses_user ON user_question_responses(user_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_responses ENABLE ROW LEVEL SECURITY;

-- Policies: Cursos (leitura pública para ativos)
CREATE POLICY "Cursos ativos são públicos" ON courses
  FOR SELECT USING (is_ativo = true);

CREATE POLICY "Admins podem gerenciar cursos" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies: Aulas (leitura para usuários autenticados)
CREATE POLICY "Aulas são visíveis para autenticados" ON lessons
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem gerenciar aulas" ON lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies: Perguntas (leitura para autenticados)
CREATE POLICY "Perguntas são visíveis para autenticados" ON questions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem gerenciar perguntas" ON questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies: Opções (leitura para autenticados)
CREATE POLICY "Opções são visíveis para autenticados" ON question_options
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins podem gerenciar opções" ON question_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies: Progresso do usuário (usuário vê/edita próprio progresso)
CREATE POLICY "Usuário pode ver seu progresso" ON user_lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode inserir seu progresso" ON user_lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todo progresso" ON user_lesson_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies: Respostas do quiz
CREATE POLICY "Usuário pode ver suas respostas" ON user_question_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode inserir suas respostas" ON user_question_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar suas respostas" ON user_question_responses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas respostas" ON user_question_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- Dados Iniciais (Migração dos 3 cursos)
-- ============================================

-- Curso 1: Fundamentos da Fé
INSERT INTO courses (slug, titulo, descricao, descricao_completa, thumbnail_url, instrutor, duracao_total, nivel, is_novo, ordem)
VALUES (
  'fundamentos-da-fe',
  'Fundamentos da Fé',
  'Conheça os pilares essenciais da fé cristã e fortaleça sua caminhada espiritual.',
  'Neste curso abrangente, você aprenderá os fundamentos essenciais da fé cristã. Desde os princípios básicos da salvação até a compreensão profunda da natureza de Deus, este curso foi projetado para fortalecer sua base espiritual e prepará-lo para uma vida cristã mais consistente e frutífera.',
  '/images/fundamentos.jpg',
  'Pr. Marcos Silva',
  '6h 30min',
  'Iniciante',
  true,
  1
);

-- Curso 2: Vida de Oração
INSERT INTO courses (slug, titulo, descricao, descricao_completa, thumbnail_url, instrutor, duracao_total, nivel, ordem)
VALUES (
  'vida-de-oracao',
  'Vida de Oração',
  'Desenvolva uma vida de oração mais profunda e significativa.',
  'Descubra os segredos de uma vida de oração poderosa e transformadora. Este curso vai além das técnicas, mergulhando no coração da comunhão com Deus através da oração.',
  '/images/oracao.jpg',
  'Pra. Ana Costa',
  '4h 15min',
  'Intermediário',
  2
);

-- Curso 3: Panorama Bíblico
INSERT INTO courses (slug, titulo, descricao, descricao_completa, thumbnail_url, instrutor, duracao_total, nivel, ordem)
VALUES (
  'panorama-biblico',
  'Panorama Bíblico',
  'Uma jornada completa através de toda a Bíblia, do Gênesis ao Apocalipse.',
  'Explore a história completa da redenção através de uma jornada fascinante por toda a Bíblia. Desde a criação até a nova criação, você compreenderá como cada livro se conecta na grande narrativa do amor de Deus pela humanidade.',
  '/images/biblia.jpg',
  'Pr. João Oliveira',
  '10h 45min',
  'Avançado',
  3
);

-- Aulas do Curso 1: Fundamentos da Fé
INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Introdução ao Curso', 'Qx8cUj9mfSw', '15:00', 1, false FROM courses WHERE slug = 'fundamentos-da-fe';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'A Natureza de Deus', 'Qx8cUj9mfSw', '35:00', 2, true FROM courses WHERE slug = 'fundamentos-da-fe';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'A Pessoa de Jesus', 'Qx8cUj9mfSw', '40:00', 3, true FROM courses WHERE slug = 'fundamentos-da-fe';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'O Espírito Santo', 'Qx8cUj9mfSw', '35:00', 4, true FROM courses WHERE slug = 'fundamentos-da-fe';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Salvação pela Graça', 'Qx8cUj9mfSw', '30:00', 5, true FROM courses WHERE slug = 'fundamentos-da-fe';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'A Bíblia: Palavra de Deus', 'Qx8cUj9mfSw', '25:00', 6, false FROM courses WHERE slug = 'fundamentos-da-fe';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Fé e Obras', 'Qx8cUj9mfSw', '30:00', 7, true FROM courses WHERE slug = 'fundamentos-da-fe';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Batismo e Ceia', 'Qx8cUj9mfSw', '35:00', 8, false FROM courses WHERE slug = 'fundamentos-da-fe';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'A Igreja', 'Qx8cUj9mfSw', '30:00', 9, true FROM courses WHERE slug = 'fundamentos-da-fe';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Vida Cristã Prática', 'Qx8cUj9mfSw', '40:00', 10, false FROM courses WHERE slug = 'fundamentos-da-fe';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Crescimento Espiritual', 'Qx8cUj9mfSw', '35:00', 11, true FROM courses WHERE slug = 'fundamentos-da-fe';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Conclusão e Próximos Passos', 'Qx8cUj9mfSw', '20:00', 12, false FROM courses WHERE slug = 'fundamentos-da-fe';

-- Aulas do Curso 2: Vida de Oração
INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'O que é Oração', 'Qx8cUj9mfSw', '20:00', 1, false FROM courses WHERE slug = 'vida-de-oracao';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Tipos de Oração', 'Qx8cUj9mfSw', '35:00', 2, true FROM courses WHERE slug = 'vida-de-oracao';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'O Pai Nosso', 'Qx8cUj9mfSw', '40:00', 3, true FROM courses WHERE slug = 'vida-de-oracao';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Oração Intercessória', 'Qx8cUj9mfSw', '30:00', 4, true FROM courses WHERE slug = 'vida-de-oracao';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Jejum e Oração', 'Qx8cUj9mfSw', '35:00', 5, false FROM courses WHERE slug = 'vida-de-oracao';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Oração no Espírito', 'Qx8cUj9mfSw', '30:00', 6, true FROM courses WHERE slug = 'vida-de-oracao';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Obstáculos à Oração', 'Qx8cUj9mfSw', '25:00', 7, true FROM courses WHERE slug = 'vida-de-oracao';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Desenvolvendo Hábito de Oração', 'Qx8cUj9mfSw', '20:00', 8, false FROM courses WHERE slug = 'vida-de-oracao';

-- Aulas do Curso 3: Panorama Bíblico
INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Introdução à Bíblia', 'Qx8cUj9mfSw', '25:00', 1, false FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Pentateuco', 'Qx8cUj9mfSw', '50:00', 2, true FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Livros Históricos', 'Qx8cUj9mfSw', '55:00', 3, true FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Livros Poéticos', 'Qx8cUj9mfSw', '45:00', 4, true FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Profetas Maiores', 'Qx8cUj9mfSw', '50:00', 5, true FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Profetas Menores', 'Qx8cUj9mfSw', '45:00', 6, false FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Período Intertestamentário', 'Qx8cUj9mfSw', '30:00', 7, false FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Evangelhos', 'Qx8cUj9mfSw', '55:00', 8, true FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Atos dos Apóstolos', 'Qx8cUj9mfSw', '40:00', 9, true FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Cartas Paulinas', 'Qx8cUj9mfSw', '50:00', 10, true FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Cartas Gerais', 'Qx8cUj9mfSw', '35:00', 11, false FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Apocalipse', 'Qx8cUj9mfSw', '45:00', 12, true FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Linha do Tempo Bíblica', 'Qx8cUj9mfSw', '30:00', 13, false FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Como Estudar a Bíblia', 'Qx8cUj9mfSw', '35:00', 14, true FROM courses WHERE slug = 'panorama-biblico';

INSERT INTO lessons (course_id, titulo, video_id, duracao, ordem, has_quiz)
SELECT id, 'Conclusão', 'Qx8cUj9mfSw', '15:00', 15, false FROM courses WHERE slug = 'panorama-biblico';

-- Perguntas de exemplo para a aula "A Natureza de Deus" (Fundamentos da Fé)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT id INTO lesson_id_var FROM lessons WHERE titulo = 'A Natureza de Deus' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual atributo descreve Deus como sendo eterno, sem início nem fim?', 'A eternidade de Deus significa que Ele existe fora do tempo. Ele não teve começo e não terá fim, existindo em um eterno presente.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Onipresença', false, 1),
  (q1_id, 'Eternidade', true, 2),
  (q1_id, 'Onipotência', false, 3),
  (q1_id, 'Santidade', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O que significa dizer que Deus é onisciente?', 'Onisciência significa que Deus conhece todas as coisas - passado, presente e futuro. Nada está oculto aos Seus olhos.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Que Deus está presente em todos os lugares', false, 1),
  (q2_id, 'Que Deus pode fazer todas as coisas', false, 2),
  (q2_id, 'Que Deus conhece todas as coisas', true, 3),
  (q2_id, 'Que Deus é perfeitamente santo', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quantas pessoas formam a Trindade?', 'A Trindade é formada por três pessoas distintas: Pai, Filho e Espírito Santo. São três pessoas em um só Deus - um mistério central da fé cristã.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Uma', false, 1),
  (q3_id, 'Duas', false, 2),
  (q3_id, 'Três', true, 3),
  (q3_id, 'Quatro', false, 4);
END $$;
