/**
 * Normaliza URLs de imagens
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "/images/default-course.jpg";
  return url;
}
