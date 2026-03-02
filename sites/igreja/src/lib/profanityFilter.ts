import { Profanity } from "@2toad/profanity";

const profanity = new Profanity({
  languages: ["pt", "en"],
  wholeWord: false,
});

// Palavras extras que a lib pode não cobrir
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
