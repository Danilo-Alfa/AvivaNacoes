// Types para o sistema de cursos e quiz do banco de dados

export interface Course {
  id: string;
  slug: string;
  titulo: string;
  descricao: string | null;
  descricao_completa: string | null;
  thumbnail_url: string | null;
  instrutor: string | null;
  duracao_total: string | null;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado' | null;
  is_novo: boolean;
  is_ativo: boolean;
  ordem: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  titulo: string;
  video_id: string;
  duracao: string | null;
  ordem: number;
  has_quiz: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  lesson_id: string;
  texto_pergunta: string;
  explicacao: string | null;
  ordem: number;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  texto_opcao: string;
  is_correta: boolean;
  ordem: number;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  completed_at: string;
}

export interface UserQuestionResponse {
  id: string;
  user_id: string;
  question_id: string;
  selected_option_id: string;
  is_correct: boolean;
  answered_at: string;
}

// Types compostos para uso nos componentes

export interface LessonWithProgress extends Lesson {
  is_completed: boolean;
  is_locked: boolean;
}

export interface CourseWithLessons extends Course {
  lessons: LessonWithProgress[];
  lessons_count: number;
  completed_lessons_count: number;
}

export interface QuestionWithOptions extends Question {
  options: QuestionOption[];
}

export interface QuizResult {
  total_questions: number;
  correct_answers: number;
  percentage: number;
  passed: boolean;
  responses: {
    question_id: string;
    selected_option_id: string;
    is_correct: boolean;
  }[];
}

// Types para formulários do admin

export interface CreateCourseInput {
  slug: string;
  titulo: string;
  descricao?: string;
  descricao_completa?: string;
  thumbnail_url?: string;
  instrutor?: string;
  duracao_total?: string;
  nivel?: 'Iniciante' | 'Intermediário' | 'Avançado';
  is_novo?: boolean;
  is_ativo?: boolean;
  ordem?: number;
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {
  id: string;
}

export interface CreateLessonInput {
  course_id: string;
  titulo: string;
  video_id: string;
  duracao?: string;
  ordem: number;
  has_quiz?: boolean;
}

export interface UpdateLessonInput extends Partial<Omit<CreateLessonInput, 'course_id'>> {
  id: string;
}

export interface CreateQuestionInput {
  lesson_id: string;
  texto_pergunta: string;
  explicacao?: string;
  ordem?: number;
  options: {
    texto_opcao: string;
    is_correta: boolean;
    ordem?: number;
  }[];
}

export interface UpdateQuestionInput {
  id: string;
  texto_pergunta?: string;
  explicacao?: string;
  ordem?: number;
  options?: {
    id?: string;
    texto_opcao: string;
    is_correta: boolean;
    ordem?: number;
  }[];
}
