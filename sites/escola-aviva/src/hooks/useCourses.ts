import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Course } from '@/types/course';

export interface CourseWithLessonsCount extends Course {
  lessons_count: number;
}

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async (): Promise<CourseWithLessonsCount[]> => {
      // Buscar cursos
      const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_ativo', true)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar cursos:', error);
        throw error;
      }

      if (!courses || courses.length === 0) {
        return [];
      }

      // Buscar contagem de aulas por curso
      const courseIds = courses.map(c => c.id);
      const { data: lessonCounts, error: lessonsError } = await supabase
        .from('lessons')
        .select('course_id')
        .in('course_id', courseIds);

      if (lessonsError) {
        console.error('Erro ao buscar aulas:', lessonsError);
      }

      // Contar aulas por curso
      const countByCoursseId = (lessonCounts || []).reduce((acc: Record<string, number>, lesson) => {
        acc[lesson.course_id] = (acc[lesson.course_id] || 0) + 1;
        return acc;
      }, {});

      return courses.map(course => ({
        ...course,
        lessons_count: countByCoursseId[course.id] || 0,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  });
}

export function useCourseBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: async (): Promise<Course | null> => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Erro ao buscar curso:', error);
        throw error;
      }

      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
