import { CourseCardProps } from "@/components/courses/CourseCard";
import { Lesson } from "@/components/courses/LessonList";
import courseThumb1 from "@/assets/course-thumb-1.jpg";
import courseThumb2 from "@/assets/course-thumb-2.jpg";
import courseThumb3 from "@/assets/course-thumb-3.jpg";

export interface CourseData extends CourseCardProps {
  lessons: Lesson[];
  fullDescription: string;
}

export const coursesData: CourseData[] = [
  {
    id: "fundamentos-da-fe",
    title: "Fundamentos da Fé",
    description: "Uma jornada pelos pilares essenciais da vida cristã, explorando doutrinas fundamentais e práticas espirituais.",
    fullDescription: "Este curso é uma jornada transformadora pelos fundamentos essenciais da fé cristã. Você aprenderá sobre as doutrinas centrais do cristianismo, como desenvolver uma vida de oração efetiva, e como aplicar os princípios bíblicos no dia a dia. Cada aula foi cuidadosamente preparada para edificar sua fé e fortalecer seu relacionamento com Deus.",
    thumbnail: courseThumb1,
    instructor: "Pr. Carlos Silva",
    duration: "6h 30min",
    lessonsCount: 12,
    level: "Iniciante",
    isNew: true,
    lessons: [
      { id: "1", title: "Introdução: O que é fé?", duration: "28:45", videoId: "dQw4w9WgXcQ", isCompleted: true },
      { id: "2", title: "A Natureza de Deus", duration: "35:12", videoId: "dQw4w9WgXcQ", isCompleted: true },
      { id: "3", title: "A Pessoa de Jesus Cristo", duration: "42:30", videoId: "dQw4w9WgXcQ" },
      { id: "4", title: "O Espírito Santo em nossas vidas", duration: "38:15", videoId: "dQw4w9WgXcQ" },
      { id: "5", title: "A Importância da Oração", duration: "30:00", videoId: "dQw4w9WgXcQ" },
      { id: "6", title: "Estudando a Bíblia", duration: "45:20", videoId: "dQw4w9WgXcQ" },
      { id: "7", title: "Vida em Comunidade", duration: "32:10", videoId: "dQw4w9WgXcQ" },
      { id: "8", title: "Servindo ao Próximo", duration: "28:55", videoId: "dQw4w9WgXcQ" },
      { id: "9", title: "Discipulado e Crescimento", duration: "40:30", videoId: "dQw4w9WgXcQ" },
      { id: "10", title: "Batalha Espiritual", duration: "35:45", videoId: "dQw4w9WgXcQ" },
      { id: "11", title: "Frutos do Espírito", duration: "33:20", videoId: "dQw4w9WgXcQ" },
      { id: "12", title: "Vivendo pela Fé", duration: "38:00", videoId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "vida-de-oracao",
    title: "Vida de Oração",
    description: "Aprenda a desenvolver uma vida de oração profunda e transformadora, conectando-se intimamente com Deus.",
    fullDescription: "A oração é a chave para uma vida espiritual vibrante. Neste curso, você descobrirá diferentes formas de oração, aprenderá a ouvir a voz de Deus, e desenvolverá disciplinas que transformarão sua comunhão diária. Cada aula traz ensinamentos práticos e testemunhos inspiradores.",
    thumbnail: courseThumb2,
    instructor: "Pra. Ana Beatriz",
    duration: "4h 45min",
    lessonsCount: 8,
    level: "Intermediário",
    lessons: [
      { id: "1", title: "O Poder da Oração", duration: "32:00", videoId: "dQw4w9WgXcQ" },
      { id: "2", title: "Tipos de Oração", duration: "45:30", videoId: "dQw4w9WgXcQ" },
      { id: "3", title: "Ouvindo a Voz de Deus", duration: "38:15", videoId: "dQw4w9WgXcQ" },
      { id: "4", title: "Jejum e Oração", duration: "35:45", videoId: "dQw4w9WgXcQ" },
      { id: "5", title: "Intercessão", duration: "40:20", videoId: "dQw4w9WgXcQ" },
      { id: "6", title: "Oração em Comunidade", duration: "28:30", videoId: "dQw4w9WgXcQ" },
      { id: "7", title: "Superando Obstáculos", duration: "33:00", videoId: "dQw4w9WgXcQ" },
      { id: "8", title: "Vida de Adoração", duration: "42:10", videoId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "estudo-biblico",
    title: "Panorama Bíblico",
    description: "Uma visão completa da Bíblia, do Gênesis ao Apocalipse, entendendo o plano de Deus através das Escrituras.",
    fullDescription: "Este curso oferece uma visão panorâmica de toda a Bíblia. Você entenderá como cada livro se conecta na grande narrativa da redenção, aprenderá métodos de estudo bíblico efetivos, e descobrirá como aplicar as verdades eternas em sua vida cotidiana.",
    thumbnail: courseThumb3,
    instructor: "Pr. Marcos Oliveira",
    duration: "8h 15min",
    lessonsCount: 15,
    level: "Avançado",
    lessons: [
      { id: "1", title: "Introdução à Bíblia", duration: "30:00", videoId: "dQw4w9WgXcQ" },
      { id: "2", title: "Pentateuco: A Criação", duration: "42:30", videoId: "dQw4w9WgXcQ" },
      { id: "3", title: "Os Livros Históricos", duration: "38:45", videoId: "dQw4w9WgXcQ" },
      { id: "4", title: "Poesia e Sabedoria", duration: "35:20", videoId: "dQw4w9WgXcQ" },
      { id: "5", title: "Profetas Maiores", duration: "45:00", videoId: "dQw4w9WgXcQ" },
      { id: "6", title: "Profetas Menores", duration: "40:15", videoId: "dQw4w9WgXcQ" },
      { id: "7", title: "Período Intertestamentário", duration: "28:30", videoId: "dQw4w9WgXcQ" },
      { id: "8", title: "Os Evangelhos", duration: "48:00", videoId: "dQw4w9WgXcQ" },
      { id: "9", title: "Atos dos Apóstolos", duration: "35:45", videoId: "dQw4w9WgXcQ" },
      { id: "10", title: "Cartas Paulinas I", duration: "42:20", videoId: "dQw4w9WgXcQ" },
      { id: "11", title: "Cartas Paulinas II", duration: "38:30", videoId: "dQw4w9WgXcQ" },
      { id: "12", title: "Cartas Gerais", duration: "33:15", videoId: "dQw4w9WgXcQ" },
      { id: "13", title: "Hebreus", duration: "40:00", videoId: "dQw4w9WgXcQ" },
      { id: "14", title: "Apocalipse", duration: "45:30", videoId: "dQw4w9WgXcQ" },
      { id: "15", title: "Aplicação Prática", duration: "32:00", videoId: "dQw4w9WgXcQ" },
    ],
  },
];

export function getCourseById(id: string): CourseData | undefined {
  return coursesData.find((course) => course.id === id);
}
