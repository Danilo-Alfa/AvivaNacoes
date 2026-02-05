/**
 * Retorna o caminho base para assets estáticos
 */
export const basePath = "/";

/**
 * Constrói o caminho completo para um asset
 */
export function asset(path: string): string {
  // Remove barra inicial se existir para evitar duplicação
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${basePath}${cleanPath}`;
}
