import {
  BookOpen,
  Calendar,
  Church,
  FolderKanban,
  GraduationCap,
  Heart,
  Home,
  Image,
  MessageSquare,
  Newspaper,
  Radio,
  Users,
  Video,
} from "lucide-react";

// Links principais - exibidos na barra superior desktop
export const primaryNavigation = [
  { name: "QUEM SOMOS", href: "/quem-somos" },
  { name: "NOSSAS IGREJAS", href: "/nossas-igrejas" },
  { name: "PROGRAMAÇÃO", href: "/programacao" },
  { name: "REDES SOCIAIS", href: "/redes-sociais" },
];

// Seções organizadas para o menu mobile
export const mobileNavigationSections = [
  {
    title: "Navegação Principal",
    items: [
      { name: "Home", href: "/", icon: Home, color: "bg-blue-500" },
      {
        name: "Quem Somos",
        href: "/quem-somos",
        icon: Users,
        color: "bg-indigo-500",
      },
      {
        name: "Nossas Igrejas",
        href: "/nossas-igrejas",
        icon: Church,
        color: "bg-purple-500",
      },
      {
        name: "Programação",
        href: "/programacao",
        icon: Calendar,
        color: "bg-pink-500",
      },
    ],
  },
  {
    title: "Conteúdo",
    items: [
      {
        name: "Live",
        href: "/live",
        icon: Radio,
        color: "bg-red-500",
        isLiveItem: true,
      },
      {
        name: "Projetos",
        href: "/projetos",
        icon: FolderKanban,
        color: "bg-orange-500",
      },
      { name: "Fotos", href: "/galerias", icon: Image, color: "bg-amber-500" },
      {
        name: "Eventos",
        href: "/eventos",
        icon: Calendar,
        color: "bg-yellow-500",
        hasNewBadge: true,
      },
      { name: "Vídeos", href: "/videos", icon: Video, color: "bg-lime-500" },
    ],
  },
  {
    title: "Formação",
    items: [
      {
        name: "Escola Aviva",
        href: "https://escola-aviva-nacoes.vercel.app",
        icon: GraduationCap,
        color: "bg-violet-600",
        isExternal: true,
      },
    ],
  },
  {
    title: "Devocional",
    items: [
      {
        name: "Versículo do Dia",
        href: "/versiculo-do-dia",
        icon: BookOpen,
        color: "bg-emerald-500",
      },
      {
        name: "Jornal",
        href: "/jornal",
        icon: Newspaper,
        color: "bg-teal-500",
      },
    ],
  },
  {
    title: "Contato",
    items: [
      {
        name: "Redes Sociais",
        href: "/redes-sociais",
        icon: Heart,
        color: "bg-rose-500",
      },
      {
        name: "Fale Conosco",
        href: "/fale-conosco",
        icon: MessageSquare,
        color: "bg-cyan-500",
      },
    ],
  },
];

// Seções organizadas para a sidebar desktop
export const sidebarSections = [
  {
    title: "PRINCIPAL",
    items: [{ name: "HOME", href: "/", icon: Home }],
  },
  {
    title: "CONTEÚDO",
    items: [
      { name: "LIVE", href: "/live", icon: Radio, isLiveItem: true },
      { name: "PROJETOS", href: "/projetos", icon: FolderKanban },
      { name: "FOTOS", href: "/galerias", icon: Image },
      { name: "EVENTOS", href: "/eventos", icon: Calendar, hasNewBadge: true },
      { name: "VÍDEOS", href: "/videos", icon: Video },
    ],
  },
  {
    title: "FORMAÇÃO",
    items: [
      { name: "ESCOLA AVIVA", href: "https://escola-aviva-nacoes.vercel.app", icon: GraduationCap, isExternal: true },
    ],
  },
  {
    title: "DEVOCIONAL",
    items: [
      { name: "VERSÍCULO", href: "/versiculo-do-dia", icon: BookOpen },
      { name: "JORNAL", href: "/jornal", icon: Newspaper },
    ],
  },
  {
    title: "CONTATO",
    items: [
      { name: "FALE CONOSCO", href: "/fale-conosco", icon: MessageSquare },
    ],
  },
];
