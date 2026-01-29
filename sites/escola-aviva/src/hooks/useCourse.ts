import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Course, Lesson, LessonWithProgress, CourseWithLessons, UserLessonProgress } from '@/types/course';

export function useCourse(courseId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course', courseId, user?.id],
    queryFn: async (): Promise<CourseWithLessons | null> => {
      if (!courseId) return null;

      // Buscar curso
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) {
        console.error('Erro ao buscar curso:', courseError);
        throw courseError;
      }

      if (!course) return null;

      // Buscar aulas do curso
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('ordem', { ascending: true });

      if (lessonsError) {
        console.error('Erro ao buscar aulas:', lessonsError);
        throw lessonsError;
      }

      // Buscar progresso do usuário (se logado)
      let userProgress: UserLessonProgress[] = [];
      if (user?.id) {
        const { data: progress, error: progressError } = await supabase
          .from('user_lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId);

        if (progressError) {
          console.error('Erro ao buscar progresso:', progressError);
        } else {
          userProgress = progress || [];
        }
      }

      // Mapear aulas com progresso
      const completedLessonIds = new Set(userProgress.map(p => p.lesson_id));

      const lessonsWithProgress: LessonWithProgress[] = (lessons || []).map((lesson: Lesson, index: number) => {
        const isCompleted = completedLessonIds.has(lesson.id);

        // Primeira aula sempre desbloqueada, outras baseadas no progresso da anterior
        let isLocked = false;
        if (index > 0) {
          const previousLesson = lessons[index - 1];
          isLocked = !completedLessonIds.has(previousLesson.id);
        }

        return {
          ...lesson,
          is_completed: isCompleted,
          is_locked: isLocked,
        };
      });

      const completedCount = lessonsWithProgress.filter(l => l.is_completed).length;

      return {
        ...course,
        lessons: lessonsWithProgress,
        lessons_count: lessonsWithProgress.length,
        completed_lessons_count: completedCount,
      };
    },
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutos de cache
  });
}

export function useCourseBySlug(slug: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course-by-slug', slug, user?.id],
    queryFn: async (): Promise<CourseWithLessons | null> => {
      if (!slug) return null;

      // Buscar curso pelo slug
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (courseError) {
        console.error('Erro ao buscar curso:', courseError);
        throw courseError;
      }

      if (!course) return null;

      // Buscar aulas do curso
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', course.id)
        .order('ordem', { ascending: true });

      if (lessonsError) {
        console.error('Erro ao buscar aulas:', lessonsError);
        throw lessonsError;
      }

      // Buscar progresso do usuário (se logado)
      let userProgress: UserLessonProgress[] = [];
      if (user?.id) {
        const { data: progress, error: progressError } = await supabase
          .from('user_lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', course.id);

        if (progressError) {
          console.error('Erro ao buscar progresso:', progressError);
        } else {
          userProgress = progress || [];
        }
      }

      // Mapear aulas com progresso
      const completedLessonIds = new Set(userProgress.map(p => p.lesson_id));

      const lessonsWithProgress: LessonWithProgress[] = (lessons || []).map((lesson: Lesson, index: number) => {
        const isCompleted = completedLessonIds.has(lesson.id);

        // Primeira aula sempre desbloqueada, outras baseadas no progresso da anterior
        let isLocked = false;
        if (index > 0) {
          const previousLesson = lessons[index - 1];
          isLocked = !completedLessonIds.has(previousLesson.id);
        }

        return {
          ...lesson,
          is_completed: isCompleted,
          is_locked: isLocked,
        };
      });

      const completedCount = lessonsWithProgress.filter(l => l.is_completed).length;

      return {
        ...course,
        lessons: lessonsWithProgress,
        lessons_count: lessonsWithProgress.length,
        completed_lessons_count: completedCount,
      };
    },
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
  });
}
