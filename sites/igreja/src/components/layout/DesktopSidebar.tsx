import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { sidebarSections } from "./navigation-data";

interface DesktopSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  isLiveActive: boolean;
  location: { pathname: string };
}

export default function DesktopSidebar({
  sidebarOpen,
  setSidebarOpen,
  isLiveActive,
  location,
}: DesktopSidebarProps) {
  return (
    <aside
      className={`hidden lg:flex flex-col fixed left-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] bg-background/98 backdrop-blur-sm transition-all duration-300 z-30 border-r border-border/50 ${
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
                <span className="text-xs font-bold text-muted-foreground tracking-wider">
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
                const isExternal = "isExternal" in item && item.isExternal;
                const isActive = !isExternal && location.pathname === item.href;

                const SidebarLink = isExternal ? "a" : Link;
                const linkProps = isExternal
                  ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                  : { to: item.href };

                return (
                  <SidebarLink
                    key={item.name}
                    {...linkProps as any}
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
                      <span className="relative z-10 px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded flex items-center gap-1 shadow-md shadow-red-500/30">
                        <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        LIVE
                      </span>
                    )}

                    {/* Badge NOVO na sidebar */}
                    {hasNewBadge && sidebarOpen && (
                      <span className="relative z-10 px-1.5 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-accent to-amber-500 rounded shadow-md shadow-accent/30">
                        NOVO
                      </span>
                    )}

                    {/* Tooltip aprimorado quando colapsado */}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-foreground text-background text-xs font-medium rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl flex items-center gap-2">
                        {item.name}
                        {isLiveItem && isLiveActive && (
                          <span className="px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded flex items-center gap-1">
                            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                            LIVE
                          </span>
                        )}
                        {hasNewBadge && (
                          <span className="px-1.5 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-accent to-amber-500 rounded">
                            NOVO
                          </span>
                        )}
                        {/* Seta do tooltip */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-foreground rotate-45" />
                      </div>
                    )}
                  </SidebarLink>
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
              <p className="text-xs italic text-muted-foreground leading-relaxed">
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
              <p className="text-xs text-muted-foreground">
                Igreja Cristã • 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
