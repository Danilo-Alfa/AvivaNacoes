import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useMarkLessonComplete() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lessonId,
      courseId,
    }: {
      lessonId: string;
      courseId: string;
    }) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            course_id: courseId,
            completed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' }
        )
        .select()
        .single();

      if (error) {
        console.error('Erro ao marcar aula como concluída:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidar cache do curso para atualizar progresso
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course-by-slug'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUnmarkLessonComplete() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lessonId,
      courseId,
    }: {
      lessonId: string;
      courseId: string;
    }) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('user_lesson_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId);

      if (error) {
        console.error('Erro ao desmarcar aula:', error);
        throw error;
      }

      return { lessonId, courseId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course-by-slug'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useLessonProgress(lessonId: string | undefined, courseId: string | undefined) {
  const { user } = useAuth();

  return {
    isCompleted: false, // Will be determined by useCourse hook
  };
}
