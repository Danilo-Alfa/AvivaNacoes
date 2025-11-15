import { Link, useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  Menu,
  ChevronLeft,
  ChevronRight,
  Home,
  FolderKanban,
  Image,
  Calendar,
  Video,
  MessageSquare,
  Newspaper,
  BookOpen,
  Radio,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Links principais - exibidos na barra superior
const primaryNavigation = [
  { name: "QUEM SOMOS", href: "/quem-somos" },
  { name: "NOSSAS IGREJAS", href: "/nossas-igrejas" },
  { name: "PROGRAMAÇÃO", href: "/programacao" },
  { name: "REDES SOCIAIS", href: "/redes-sociais" },
];

// Links secundários - exibidos na sidebar lateral
const secondaryNavigation = [
  { name: "LIVE", href: "/live", icon: Radio },
  { name: "PROJETOS", href: "/projetos", icon: FolderKanban },
  { name: "FOTOS", href: "/galerias", icon: Image },
  { name: "EVENTOS", href: "/eventos", icon: Calendar },
  { name: "VÍDEOS", href: "/videos", icon: Video },
  { name: "VERSÍCULO DO DIA", href: "/versiculo-do-dia", icon: BookOpen },
  { name: "JORNAL", href: "/jornal", icon: Newspaper },
  { name: "FALE CONOSCO", href: "/fale-conosco", icon: MessageSquare },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed */}
      <header className="fixed top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <nav className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-xl md:text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                IGREJA AVIVA
              </div>
            </Link>

            {/* Primary Navigation - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="rounded-full"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Mobile Menu with Sheet */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden rounded-full"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 flex flex-col gap-4">
                    {[...primaryNavigation, ...secondaryNavigation].map(
                      (item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                            location.pathname === item.href
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {item.name}
                        </Link>
                      )
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      {/* Layout com Sidebar */}
      <div className="flex pt-16">
        {/* Sidebar - Desktop apenas - Fixed */}
        <aside
          className={`hidden md:block fixed left-0 top-16 h-screen border-r-2 border-border bg-background/95 backdrop-blur transition-all duration-300 overflow-y-auto ${
            sidebarOpen ? "w-60" : "w-16"
          }`}
        >
          <div className="flex flex-col">
            {/* Toggle Button */}
            <div className="p-3 border-b-2 border-border flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-full"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Navigation Items */}
            <nav className="p-3 space-y-2 pb-6">
              <Link
                to="/"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  !sidebarOpen && "justify-center"
                } ${
                  location.pathname === "/"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Home className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">HOME</span>
                )}
              </Link>

              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      !sidebarOpen && "justify-center"
                    } ${
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content - Com margin-left para compensar a sidebar fixa */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "md:ml-60" : "md:ml-16"
          }`}
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t-2 border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-foreground">
                Igreja Aviva
              </h3>
              <p className="text-sm text-muted-foreground">
                Levando esperança e transformação através da palavra de Deus.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-foreground">
                Redes Sociais
              </h3>
              <p className="text-sm text-muted-foreground">
                Siga-nos nas redes sociais para ficar por dentro de tudo!
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t-2 border-border text-center text-sm text-muted-foreground">
            © 2024 Igreja Aviva. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
