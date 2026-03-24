import { Profanity } from "@2toad/profanity";

const profanity = new Profanity({
  languages: ["pt", "en"],
  wholeWord: false,
});

// Palavras extras que a lib pode nao cobrir
profanity.addWords([
  "fdp",
  "viado",
  "vadia",
  "vagabunda",
  "vagabundo",
  "corno",
  "desgraça",
  "lixo",
  "nazi",
  "nazista",
  "racista",
  "nigga",
]);

export function contemProfanidade(texto: string): boolean {
  return profanity.exists(texto);
}

export function censurarTexto(texto: string): string {
  return profanity.censor(texto);
}

export function validarNome(nome: string): string | null {
  const n = nome.trim();
  if (n.length < 2) return "Nome deve ter pelo menos 2 caracteres.";
  if (n.length > 50) return "Nome muito longo.";
  if (/^[\d\s\W]+$/.test(n)) return "Nome deve conter letras.";
  if (contemProfanidade(n)) return "Nome nao permitido.";
  return null;
}
