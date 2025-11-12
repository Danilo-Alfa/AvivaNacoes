import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "QUEM SOMOS", href: "/quem-somos" },
  { name: "NOSSAS IGREJAS", href: "/nossas-igrejas" },
  { name: "PROJETOS", href: "/projetos" },
  { name: "PROGRAMAÇÃO", href: "/programacao" },
  { name: "GALERIAS DE FOTOS", href: "/galerias" },
  { name: "EVENTOS", href: "/eventos" },
  { name: "VÍDEOS", href: "/videos" },
  { name: "FALE CONOSCO", href: "/fale-conosco" },
  { name: "JORNAL AVIVA NEWS", href: "/jornal" },
  { name: "REDES SOCIAIS", href: "/redes-sociais" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <nav className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                IGREJA AVIVA
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex xl:items-center xl:gap-1 xl:flex-wrap">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-2.5 py-2 text-xs font-medium transition-colors hover:text-primary whitespace-nowrap ${
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
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t-2 border-border">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="mt-20 border-t-2 border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-foreground">Igreja Aviva</h3>
              <p className="text-sm text-muted-foreground">
                Levando esperança e transformação através da palavra de Deus.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-foreground">Redes Sociais</h3>
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
