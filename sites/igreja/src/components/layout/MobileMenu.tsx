import { Switch } from "@/components/ui/switch";
import { asset } from "@/lib/image-utils";
import { Heart, Moon, Sparkles, Sun, X } from "lucide-react";
import { Link } from "react-router-dom";
import { mobileNavigationSections } from "./navigation-data";

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  isLiveActive: boolean;
  location: { pathname: string };
}

export default function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  isDark,
  setIsDark,
  isLiveActive,
  location,
}: MobileMenuProps) {
  return (
    <>
      {/* Mobile Menu Overlay - CSS puro para confiabilidade no mobile */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel - CSS puro para confiabilidade no mobile */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-80 sm:w-96 bg-nav dark:bg-nav-dark z-50 lg:hidden flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
            {/* Header com gradiente azul profundo e elementos decorativos */}
            <div className="relative bg-gradient-to-br from-[hsl(var(--menu-gradient-from))] via-[hsl(var(--menu-gradient-via))] to-[hsl(var(--menu-gradient-to))] pt-8 pb-20 px-6 overflow-hidden">
              {/* Círculos decorativos blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />

              {/* Ícone decorativo */}
              <div className="absolute top-6 right-16 opacity-10">
                <Sparkles className="w-20 h-20 text-white" aria-hidden="true" />
              </div>

              {/* Botão fechar */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fechar menu de navegação"
                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-colors border border-white/20"
              >
                <X className="w-5 h-5 text-white" aria-hidden="true" />
              </button>

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
              {mobileNavigationSections.map((section) => (
                <div
                  key={section.title}
                  className="mb-5"
                >
                  {/* Título da seção */}
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 px-2">
                    {section.title}
                  </h3>

                  {/* Items da seção */}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      const isLiveItem =
                        "isLiveItem" in item && item.isLiveItem;
                      const hasNewBadge =
                        "hasNewBadge" in item && item.hasNewBadge;
                      const isExternal =
                        "isExternal" in item && item.isExternal;

                      const linkClass = `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 dark:bg-primary/20"
                          : "hover:bg-secondary/50"
                      }`;

                      const linkContent = (
                        <>
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
                            <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full flex items-center gap-1.5 shadow-md shadow-red-500/30">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                              </span>
                              AO VIVO
                            </span>
                          )}

                          {/* Badge NOVO */}
                          {hasNewBadge && (
                            <span className="px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-accent to-amber-500 rounded-full shadow-md shadow-accent/30">
                              NOVO
                            </span>
                          )}

                          {/* Indicador ativo */}
                          {isActive && (
                            <div className="w-2 h-2 rounded-full bg-primary dark:bg-blue-400" />
                          )}
                        </>
                      );

                      return isExternal ? (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileMenuOpen(false)}
                          className={linkClass}
                        >
                          {linkContent}
                        </a>
                      ) : (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={linkClass}
                        >
                          {linkContent}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Card CTA decorativo */}
              <div className="mt-4 mb-6">
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
              </div>
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
      </div>
    </>
  );
}
