import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Question, QuestionOption, QuestionWithOptions, QuizResult } from '@/types/course';

const PASSING_PERCENTAGE = 70;

export function useQuizQuestions(lessonId: string | undefined) {
  return useQuery({
    queryKey: ['quiz-questions', lessonId],
    queryFn: async (): Promise<QuestionWithOptions[]> => {
      if (!lessonId) return [];

      // Buscar perguntas da aula
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('ordem', { ascending: true });

      if (questionsError) {
        console.error('Erro ao buscar perguntas:', questionsError);
        throw questionsError;
      }

      if (!questions || questions.length === 0) {
        return [];
      }

      // Buscar opções de todas as perguntas
      const questionIds = questions.map((q: Question) => q.id);
      const { data: options, error: optionsError } = await supabase
        .from('question_options')
        .select('*')
        .in('question_id', questionIds)
        .order('ordem', { ascending: true });

      if (optionsError) {
        console.error('Erro ao buscar opções:', optionsError);
        throw optionsError;
      }

      // Mapear opções para suas perguntas
      const optionsByQuestion = (options || []).reduce((acc: Record<string, QuestionOption[]>, option: QuestionOption) => {
        if (!acc[option.question_id]) {
          acc[option.question_id] = [];
        }
        acc[option.question_id].push(option);
        return acc;
      }, {});

      return questions.map((question: Question): QuestionWithOptions => ({
        ...question,
        options: optionsByQuestion[question.id] || [],
      }));
    },
    enabled: !!lessonId,
    staleTime: 10 * 60 * 1000, // 10 minutos de cache
  });
}

export function useSubmitQuiz() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lessonId,
      answers,
    }: {
      lessonId: string;
      answers: Record<string, string>; // question_id -> selected_option_id
    }): Promise<QuizResult> => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar todas as opções corretas das perguntas
      const questionIds = Object.keys(answers);
      const { data: correctOptions, error: optionsError } = await supabase
        .from('question_options')
        .select('id, question_id, is_correta')
        .in('question_id', questionIds)
        .eq('is_correta', true);

      if (optionsError) {
        console.error('Erro ao verificar respostas:', optionsError);
        throw optionsError;
      }

      // Criar mapa de respostas corretas
      const correctOptionByQuestion = (correctOptions || []).reduce(
        (acc: Record<string, string>, opt: { id: string; question_id: string }) => {
          acc[opt.question_id] = opt.id;
          return acc;
        },
        {}
      );

      // Calcular resultado
      const responses = questionIds.map((questionId) => {
        const selectedOptionId = answers[questionId];
        const correctOptionId = correctOptionByQuestion[questionId];
        const isCorrect = selectedOptionId === correctOptionId;

        return {
          question_id: questionId,
          selected_option_id: selectedOptionId,
          is_correct: isCorrect,
        };
      });

      const correctAnswers = responses.filter((r) => r.is_correct).length;
      const totalQuestions = responses.length;
      const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      const passed = percentage >= PASSING_PERCENTAGE;

      // Salvar respostas no banco (upsert)
      const responsesToSave = responses.map((r) => ({
        user_id: user.id,
        question_id: r.question_id,
        selected_option_id: r.selected_option_id,
        is_correct: r.is_correct,
        answered_at: new Date().toISOString(),
      }));

      const { error: saveError } = await supabase
        .from('user_question_responses')
        .upsert(responsesToSave, { onConflict: 'user_id,question_id' });

      if (saveError) {
        console.error('Erro ao salvar respostas:', saveError);
        // Não lança erro aqui para não impedir o resultado do quiz
      }

      return {
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        percentage,
        passed,
        responses,
      };
    },
    onSuccess: (_, variables) => {
      // Invalidar cache das perguntas
      queryClient.invalidateQueries({ queryKey: ['quiz-questions', variables.lessonId] });
    },
  });
}

export function useUserQuizResponses(lessonId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-quiz-responses', lessonId, user?.id],
    queryFn: async () => {
      if (!lessonId || !user?.id) return null;

      // Buscar IDs das perguntas da aula
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id')
        .eq('lesson_id', lessonId);

      if (questionsError || !questions || questions.length === 0) {
        return null;
      }

      const questionIds = questions.map((q: { id: string }) => q.id);

      // Buscar respostas do usuário
      const { data: responses, error: responsesError } = await supabase
        .from('user_question_responses')
        .select('*')
        .eq('user_id', user.id)
        .in('question_id', questionIds);

      if (responsesError) {
        console.error('Erro ao buscar respostas:', responsesError);
        return null;
      }

      return responses;
    },
    enabled: !!lessonId && !!user?.id,
  });
}
