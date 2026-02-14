import { Switch } from "@/components/ui/switch";
import { getLiveStatus } from "@/services/liveService";
import { asset } from "@/lib/image-utils";
import { AnimatePresence, motion } from "framer-motion";
import AudioPlayer from "@/components/AudioPlayer";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Church,
  FolderKanban,
  Heart,
  Home,
  Image,
  Menu,
  MessageSquare,
  Moon,
  Newspaper,
  Radio,
  Sparkles,
  Sun,
  Users,
  Video,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Links principais - exibidos na barra superior desktop
const primaryNavigation = [
  { name: "QUEM SOMOS", href: "/quem-somos" },
  { name: "NOSSAS IGREJAS", href: "/nossas-igrejas" },
  { name: "PROGRAMAÇÃO", href: "/programacao" },
  { name: "REDES SOCIAIS", href: "/redes-sociais" },
];

// Seções organizadas para o menu mobile
const mobileNavigationSections = [
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
const sidebarSections = [
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

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const location = useLocation();

  // Verifica se a live está ativa
  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const status = await getLiveStatus();
        setIsLiveActive(status.ativa);
      } catch (error) {
        console.error("Erro ao verificar status da live:", error);
        setIsLiveActive(false);
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Detecta scroll para efeito de backdrop-blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fecha menu mobile ao mudar de rota
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Bloqueia scroll do body quando menu mobile está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", isDark ? "dark" : "light");

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (isDark) {
      if (!metaThemeColor) {
        metaThemeColor = document.createElement("meta");
        metaThemeColor.setAttribute("name", "theme-color");
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute("content", "#0e1219");
    } else {
      if (metaThemeColor) {
        metaThemeColor.remove();
      }
    }
  }, [isDark]);

  // Animações do Framer Motion
  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    }),
  };

  const sectionVariants = {
    closed: { y: 10, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header - Fixed */}
      <header className="fixed top-0 z-50 w-full">
        {/* Linha decorativa em gradiente no topo */}
        {/* <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-accent" /> */}

        <nav
          className={`transition-all duration-300 ${
            scrolled
              ? "bg-white/95 dark:bg-[#0e1219]/95 backdrop-blur-lg shadow-[0_4px_20px_-5px_hsl(var(--primary)/0.15)]"
              : "bg-white dark:bg-[#0e1219]"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo com efeito hover */}
              <Link to="/" className="flex items-center gap-3 group min-w-0">
                <div className="relative flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative"
                  >
                    <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <picture>
                      <source srcSet={asset("logoheader.webp")} type="image/webp" />
                      <img
                        src={asset("logoheader.png")}
                        alt="Logo Avivamento para as Nações"
                        width={56}
                        height={56}
                        decoding="async"
                        // @ts-expect-error fetchpriority is a valid HTML attribute
                        fetchpriority="high"
                        className="relative w-12 h-12 md:w-14 md:h-14 object-contain"
                      />
                    </picture>
                  </motion.div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Igreja Evangélica
                  </span>
                  <span className="text-md font-display font-bold text-primary dark:text-blue-400">
                    Avivamento para as Nações
                  </span>
                </div>
              </Link>

              {/* Primary Navigation - Desktop - Container Pill */}
              <div className="hidden lg:flex items-center">
                <div className="flex items-center gap-1 bg-secondary/50 dark:bg-secondary/30 rounded-2xl p-1.5">
                  {primaryNavigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl ${
                          isActive
                            ? "text-primary dark:text-white bg-white dark:bg-primary shadow-md"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Badge AO VIVO - só aparece se estiver ao vivo */}
                {isLiveActive && (
                  <Link
                    to="/live"
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full hover:bg-red-500/20 transition-colors"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">
                      AO VIVO
                    </span>
                  </Link>
                )}

                {/* Toggle de tema - Desktop */}
                <motion.button
                  onClick={() => setIsDark(!isDark)}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
                  className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl bg-secondary/50 hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Moon className="h-5 w-5" aria-hidden="true" />
                  )}
                </motion.button>

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setMobileMenuOpen(true)}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Abrir menu de navegação"
                  aria-expanded={mobileMenuOpen}
                  className="lg:hidden w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 bottom-0 w-[320px] sm:w-[380px] bg-white dark:bg-[#0e1219] z-50 lg:hidden flex flex-col overflow-hidden"
          >
            {/* Header com gradiente azul profundo e elementos decorativos */}
            <div className="relative bg-gradient-to-br from-[#1a3352] via-[#1e3a5f] to-[#2d5a8a] pt-8 pb-20 px-6 overflow-hidden">
              {/* Círculos decorativos blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />

              {/* Ícone decorativo */}
              <div className="absolute top-6 right-16 opacity-10">
                <Sparkles className="w-20 h-20 text-white" aria-hidden="true" />
              </div>

              {/* Botão fechar */}
              <motion.button
                onClick={() => setMobileMenuOpen(false)}
                whileTap={{ scale: 0.9 }}
                aria-label="Fechar menu de navegação"
                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-colors border border-white/20"
              >
                <X className="w-5 h-5 text-white" aria-hidden="true" />
              </motion.button>

              {/* Logo e mensagem de boas-vindas */}
              <div className="flex items-center gap-4 mb-4">
                <picture>
                  <source srcSet={asset("logoheader.webp")} type="image/webp" />
                  <img
                    src={asset("logoheader.png")}
                    alt="Logo Avivamento para as Nações"
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-2xl object-contain"
                  />
                </picture>
                <div>
                  <h2 className="text-white font-display text-2xl font-bold">
                    Avivamento <br/>para as Nações
                  </h2>
                  <p className="text-white/60 text-sm font-medium">
                    Menu de Navegação
                  </p>
                </div>
              </div>

              <p className="text-white/70 text-sm leading-relaxed">
                Bem-vindo! Explore nosso conteúdo e conecte-se conosco.
              </p>

              {/* Curva SVG de transição */}
              <div className="absolute -bottom-1 left-0 right-0">
                <svg
                  viewBox="0 0 380 50"
                  fill="none"
                  className="w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 50V25C0 11.193 11.193 0 25 0h330c13.807 0 25 11.193 25 25v25H0z"
                    className="fill-white dark:fill-[#0e1219]"
                  />
                </svg>
              </div>
            </div>

            {/* Conteúdo scrollável */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              {mobileNavigationSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  custom={sectionIndex}
                  variants={sectionVariants}
                  initial="closed"
                  animate="open"
                  className="mb-5"
                >
                  {/* Título da seção */}
                  <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5 px-2">
                    {section.title}
                  </h3>

                  {/* Items da seção */}
                  <div className="space-y-1">
                    {section.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      const globalIndex = sectionIndex * 10 + itemIndex;
                      const isLiveItem =
                        "isLiveItem" in item && item.isLiveItem;
                      const hasNewBadge =
                        "hasNewBadge" in item && item.hasNewBadge;

                      return (
                        <motion.div
                          key={item.href}
                          custom={globalIndex}
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                        >
                          <Link
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                              isActive
                                ? "bg-primary/10 dark:bg-primary/20"
                                : "hover:bg-secondary/50"
                            }`}
                          >
                            {/* Ícone em container colorido */}
                            <div
                              className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shadow-md`}
                            >
                              <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                            </div>

                            {/* Nome do item */}
                            <span
                              className={`flex-1 font-medium ${
                                isActive
                                  ? "text-primary dark:text-blue-400"
                                  : "text-foreground"
                              }`}
                            >
                              {item.name}
                            </span>

                            {/* Badge AO VIVO pulsante */}
                            {isLiveItem && isLiveActive && (
                              <span className="px-2 py-1 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center gap-1.5 shadow-md shadow-red-500/30">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                                </span>
                                AO VIVO
                              </span>
                            )}

                            {/* Badge NOVO */}
                            {hasNewBadge && (
                              <span className="px-2 py-1 text-[10px] font-bold text-white bg-gradient-to-r from-accent to-amber-500 rounded-full shadow-md shadow-accent/30">
                                NOVO
                              </span>
                            )}

                            {/* Indicador ativo */}
                            {isActive && (
                              <div className="w-2 h-2 rounded-full bg-primary dark:bg-blue-400" />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              {/* Card CTA decorativo */}
              <motion.div
                custom={50}
                variants={itemVariants}
                initial="closed"
                animate="open"
                className="mt-4 mb-6"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-amber-200/50 dark:border-amber-700/30">
                  {/* Decoração de fundo */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-accent/20 to-amber-400/20 rounded-full blur-2xl" />

                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/30">
                      <Heart className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-amber-900 dark:text-amber-200 text-lg">
                        Faça parte da família!
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1 leading-relaxed">
                        Venha nos visitar e experimentar o amor de Deus.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer com toggle de tema estilo switch */}
            <div className="border-t border-border/50 px-6 py-4 bg-secondary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isDark ? "bg-primary/20" : "bg-amber-100"
                    }`}
                  >
                    {isDark ? (
                      <Moon className="w-5 h-5 text-primary dark:text-blue-400" aria-hidden="true" />
                    ) : (
                      <Sun className="w-5 h-5 text-amber-600" aria-hidden="true" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {isDark ? "Modo Escuro" : "Modo Claro"}
                  </span>
                </div>
                <Switch
                  checked={isDark}
                  onCheckedChange={setIsDark}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout com Sidebar */}
      <div className="flex pt-[68px]">
        {/* Sidebar - Desktop apenas - Fixed */}
        <aside
          className={`hidden lg:flex flex-col fixed left-0 top-[68px] h-[calc(100vh-68px)] bg-background/98 backdrop-blur-sm transition-all duration-300 z-30 border-r border-border/50 ${
            sidebarOpen ? "w-60" : "w-16"
          }`}
        >
          {/* Toggle Button - No topo da sidebar */}
          <div className={`flex ${sidebarOpen ? "justify-end pr-3" : "justify-center"} pt-3 pb-2`}>
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={sidebarOpen ? "Recolher menu lateral" : "Expandir menu lateral"}
              aria-expanded={sidebarOpen}
              className="h-8 w-8 rounded-full shadow-lg bg-white dark:bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              )}
            </motion.button>
          </div>

          {/* Navigation Items com Seções */}
          <nav
            className={`flex-1 overflow-y-auto overflow-x-hidden sidebar-scrollbar ${
              sidebarOpen ? "px-3" : "px-2"
            }`}
          >
            {sidebarSections.map((section, sectionIndex) => (
              <div
                key={section.title}
                className={sectionIndex > 0 ? "mt-5" : ""}
              >
                {/* Título da seção com divisor gradiente */}
                {sidebarOpen && (
                  <div className="flex items-center gap-2 mb-3 px-3">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider">
                      {section.title}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
                  </div>
                )}

                {/* Divisória quando colapsado */}
                {!sidebarOpen && sectionIndex > 0 && (
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto mb-3" />
                )}

                {/* Items da seção */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isLiveItem = "isLiveItem" in item && item.isLiveItem;
                    const hasNewBadge =
                      "hasNewBadge" in item && item.hasNewBadge;
                    const isActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          !sidebarOpen && "justify-center px-0"
                        } ${
                          isActive
                            ? "text-white"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        }`}
                      >
                        {/* Fundo ativo com gradiente e sombra */}
                        {isActive && (
                          <motion.div
                            layoutId="sidebarActive"
                            className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 rounded-xl shadow-lg shadow-primary/30"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}

                        {/* Indicador lateral quando ativo */}
                        {isActive && (
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full shadow-lg shadow-primary/50" />
                        )}

                        {/* Ícone */}
                        <div
                          className={`relative z-10 flex items-center justify-center transition-all duration-200 ${
                            isActive && sidebarOpen
                              ? "w-8 h-8 bg-white/20 rounded-lg"
                              : ""
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 flex-shrink-0 ${
                              isActive ? "text-white" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </div>

                        {/* Nome */}
                        {sidebarOpen && (
                          <span className="relative z-10 text-sm font-medium flex-1">
                            {item.name}
                          </span>
                        )}

                        {/* Badge Live na sidebar */}
                        {isLiveItem && isLiveActive && sidebarOpen && (
                          <span className="relative z-10 px-1.5 py-0.5 text-[9px] font-bold text-white bg-red-500 rounded flex items-center gap-1 shadow-md shadow-red-500/30">
                            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                            LIVE
                          </span>
                        )}

                        {/* Badge NOVO na sidebar */}
                        {hasNewBadge && sidebarOpen && (
                          <span className="relative z-10 px-1.5 py-0.5 text-[9px] font-bold text-white bg-gradient-to-r from-accent to-amber-500 rounded shadow-md shadow-accent/30">
                            NOVO
                          </span>
                        )}

                        {/* Tooltip aprimorado quando colapsado */}
                        {!sidebarOpen && (
                          <div className="absolute left-full ml-3 px-3 py-2 bg-foreground text-background text-xs font-medium rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl flex items-center gap-2">
                            {item.name}
                            {isLiveItem && isLiveActive && (
                              <span className="px-1.5 py-0.5 text-[8px] font-bold text-white bg-red-500 rounded flex items-center gap-1">
                                <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                LIVE
                              </span>
                            )}
                            {hasNewBadge && (
                              <span className="px-1.5 py-0.5 text-[8px] font-bold text-white bg-gradient-to-r from-accent to-amber-500 rounded">
                                NOVO
                              </span>
                            )}
                            {/* Seta do tooltip */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-foreground rotate-45" />
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer da Sidebar com citação bíblica */}
          {sidebarOpen && (
            <div className="p-4 border-t border-border/50">
              {/* Citação bíblica decorativa */}
              <div className="p-3 rounded-xl bg-secondary/30 mb-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-[11px] italic text-muted-foreground leading-relaxed">
                    "Porque onde estiverem dois ou três reunidos em meu nome, aí
                    estou eu no meio deles"
                  </p>
                </div>
              </div>

              {/* Logo com gradiente */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-primary/30">
                  AN
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Avivamento para as Nações
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Igreja Cristã • 2026
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content - Com margin-left para compensar a sidebar fixa */}
        <main
          className={`flex-1 min-h-[calc(100vh-68px)] lg:transition-[margin-left] lg:duration-300 ${
            sidebarOpen ? "lg:ml-60" : "lg:ml-16"
          }`}
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer
        className={`mt-20 border-t border-border bg-muted/30 lg:transition-[margin-left] lg:duration-300 ${
          sidebarOpen ? "lg:ml-60" : "lg:ml-16"
        }`}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <picture>
                  <source srcSet={asset("logoheader.webp")} type="image/webp" />
                  <img
                    src={asset("logoheader.png")}
                    alt="Logo Avivamento para as Nações"
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 object-contain"
                  />
                </picture>
                <h3 className="text-lg font-display font-bold text-foreground">
                  Avivamento para as Nações
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Levando esperança e transformação através da palavra de Deus.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-display font-bold mb-4 text-foreground">
                Redes Sociais
              </h3>
              <p className="text-sm text-muted-foreground">
                Siga-nos nas redes sociais para ficar por dentro de tudo!
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
            © 2026 Avivamento para as Nações. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Player de Rádio */}
      {mobileMenuOpen === false && <AudioPlayer />}
    </div>
  );
}
