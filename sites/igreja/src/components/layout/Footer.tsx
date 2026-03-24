import { asset } from "@/lib/image-utils";

interface FooterProps {
  sidebarOpen: boolean;
}

export default function Footer({ sidebarOpen }: FooterProps) {
  return (
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
  );
}
