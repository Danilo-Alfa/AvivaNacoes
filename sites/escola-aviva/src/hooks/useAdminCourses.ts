import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Course, CreateCourseInput, UpdateCourseInput } from '@/types/course';

export function useAdminCourses() {
  return useQuery({
    queryKey: ['admin-courses'],
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar cursos:', error);
        throw error;
      }

      return data || [];
    },
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCourseInput): Promise<Course> => {
      const { data, error } = await supabase
        .from('courses')
        .insert(input)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar curso:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateCourseInput): Promise<Course> => {
      const { data, error } = await supabase
        .from('courses')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar curso:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar curso:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useToggleCourseActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isAtivo }: { id: string; isAtivo: boolean }): Promise<Course> => {
      const { data, error } = await supabase
        .from('courses')
        .update({ is_ativo: isAtivo })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao alterar status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
