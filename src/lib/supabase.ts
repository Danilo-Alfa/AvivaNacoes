import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Credenciais do Supabase não encontradas. Verifique o arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o TypeScript
export interface Versiculo {
  id: string;
  url_post: string;
  titulo: string | null;
  data: string;
  ativo: boolean;
  created_at: string;
}
