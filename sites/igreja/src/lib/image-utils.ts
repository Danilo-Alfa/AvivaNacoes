/**
 * Retorna o caminho base para assets estáticos
 * No Vercel: "/" | No GitHub Pages: "/AvivaNacoes/"
 */
export const basePath = import.meta.env.VITE_BASE_PATH || "/";

/**
 * Constrói o caminho completo para um asset
 */
export function asset(path: string): string {
  // Remove barra inicial se existir para evitar duplicação
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${basePath}${cleanPath}`;
}
