/**
 * Normaliza URLs de imagens para funcionar tanto no GitHub Pages quanto no Vercel
 * Remove o basepath do GitHub Pages quando não estamos nesse ambiente
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "/images/default-course.jpg";

  const basePath = import.meta.env.VITE_BASE_PATH || "/";

  // Se estamos no Vercel (basePath é "/"), remove os prefixos do GitHub Pages
  if (basePath === "/") {
    return url
      .replace(/^\/AvivaNacoes\/escolaAviva/, "")
      .replace(/^\/escolaAviva/, "");
  }

  return url;
}
