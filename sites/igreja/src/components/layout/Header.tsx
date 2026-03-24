import { asset } from "@/lib/image-utils";
import { motion } from "framer-motion";
import { Menu, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { primaryNavigation } from "./navigation-data";

interface HeaderProps {
  scrolled: boolean;
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  isLiveActive: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  location: { pathname: string };
}

export default function Header({
  scrolled,
  isDark,
  setIsDark,
  isLiveActive,
  mobileMenuOpen,
  setMobileMenuOpen,
  location,
}: HeaderProps) {
  return (
    <header className="fixed top-0 z-50 w-full">
      {/* Linha decorativa em gradiente no topo */}
      {/* <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-accent" /> */}

      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-nav/95 dark:bg-nav-dark/95 backdrop-blur-lg shadow-medium"
            : "bg-nav dark:bg-nav-dark"
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
                  <img
                    src={asset("logos/logo nova sem bg.png")}
                    alt="Logo Avivamento para as Nações"
                    width={56}
                    height={56}
                    decoding="async"
                    // @ts-expect-error fetchpriority is a valid HTML attribute
                    fetchpriority="high"
                    className="relative w-12 h-12 md:w-14 md:h-14 object-contain"
                  />
                </motion.div>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
  );
}
