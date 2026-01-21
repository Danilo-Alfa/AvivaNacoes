-- =============================================
-- TABELAS PARA O SISTEMA DE AUTENTICACAO
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Tabela de perfis de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de progresso dos cursos
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Indices para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course ON course_progress(course_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS nas tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Politicas para profiles
-- Usuarios podem ver seu proprio perfil (somente leitura)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem inserir perfis (para criar usuarios)
CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem atualizar perfis
CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem deletar perfis
CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politicas para course_progress
-- Usuarios podem ver seu proprio progresso
CREATE POLICY "Users can view own progress"
  ON course_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Usuarios podem inserir seu proprio progresso
CREATE POLICY "Users can insert own progress"
  ON course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuarios podem atualizar seu proprio progresso
CREATE POLICY "Users can update own progress"
  ON course_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins podem ver todo o progresso
CREATE POLICY "Admins can view all progress"
  ON course_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- TRIGGER PARA ATUALIZAR updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCAO PARA CRIAR USUARIO (USAR NO PAINEL ADMIN)
-- =============================================
-- Para criar um usuario, voce precisa:
-- 1. Criar o usuario no Supabase Auth (Dashboard > Authentication > Users > Add user)
-- 2. Inserir o perfil na tabela profiles com o mesmo ID

-- Exemplo de insercao de perfil (execute apos criar o usuario no Auth):
-- INSERT INTO profiles (id, email, nome, role)
-- VALUES ('uuid-do-usuario-criado', 'email@exemplo.com', 'Nome do Usuario', 'user');

-- Para tornar um usuario admin:
-- UPDATE profiles SET role = 'admin' WHERE email = 'seu@email.com';
