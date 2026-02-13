import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { getUltimosJornais, type Jornal } from "@/services/jornalService";
// Logos do jornal (em public/logos/)
const logoJOANBanner = "/logos/joanlogo recortado.jpeg";
const logoJOANBannerDark = "/logos/jornaldark.png";

// Componente para thumbnail do jornal com fallback
function JornalThumbnail({
  src,
  titulo,
}: {
  src: string;
  titulo: string;
}) {
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Timeout para considerar erro se demorar muito (Canva pode bloquear silenciosamente)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (carregando) {
        setErro(true);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [carregando]);

  if (erro) {
    return (
      <div className="w-full h-full bg-gradient-hero rounded-lg flex items-center justify-center">
        <FileText className="w-12 h-12 text-primary-foreground" aria-hidden="true" />
      </div>
    );
  }

  return (
    <>
      {carregando && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-lg z-10">
          <FileText className="w-10 h-10 text-muted-foreground animate-pulse mb-2" aria-hidden="true" />
          <p className="text-xs text-muted-foreground animate-pulse">Carregando...</p>
        </div>
      )}
      <iframe
        src={src}
        title={titulo}
        className="w-full h-full border-none pointer-events-none"
        loading="lazy"
        onLoad={() => setCarregando(false)}
        onError={() => setErro(true)}
      />
      <div className="absolute inset-0" />
    </>
  );
}

export default function Jornal() {
  const [jornais, setJornais] = useState<Jornal[]>([]);
  const [loading, setLoading] = useState(true);
  const [iframeCarregando, setIframeCarregando] = useState(true);

  useEffect(() => {
    carregarJornais();
  }, []);

  const carregarJornais = async () => {
    try {
      setLoading(true);
      const data = await getUltimosJornais();
      setJornais(data);
    } catch (error) {
      console.error("Erro ao carregar jornais:", error);
    } finally {
      setLoading(false);
    }
  };

  // Converte automaticamente links do Canva para formato embed
  const converterParaEmbed = (url: string): string => {
    // Canva Design: converte para /view?embed
    if (url.includes("canva.com/design/")) {
      // Remove parâmetros existentes
      const urlBase = url.split("?")[0];
      // Converte /edit para /view se necessário
      const urlView = urlBase.replace(/\/edit$/, "/view");
      return `${urlView}?embed`;
    }

    // Issuu: converte para embed
    if (url.includes("issuu.com/") && !url.includes("/embed")) {
      return url.replace("issuu.com/", "issuu.com/embed/");
    }

    // Para outros links, retorna o original
    return url;
  };

  const jornalMaisRecente = jornais[0];

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Banner */}
      <div className="bg-background">
        <div className="container mx-auto flex items-center justify-center px-4 py-4 md:py-6">
          <img
            src={logoJOANBanner}
            alt="JOAN - Jornal Online Aviva News"
            className="w-full md:max-h-[40vh] object-contain dark:hidden"
          />
          <img
            src={logoJOANBannerDark}
            alt="JOAN - Jornal Online Aviva News"
            className="w-full md:max-h-[40vh] object-contain hidden dark:block"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="relative bg-background pt-8">
        <div className="container mx-auto px-4 pb-12">

      {loading ? (
        <div className="min-h-[calc(100vh-400px)]">
          <p className="text-center text-muted-foreground text-lg mb-8 animate-pulse">Carregando jornais...</p>
          {/* Skeleton do Jornal em Destaque */}
          <section className="mb-16">
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="bg-muted flex items-center justify-center py-12 px-4">
                <div className="max-w-3xl w-full">
                  <div className="aspect-[9/16] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="p-6 border-t border-border bg-background">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </section>

          {/* Skeleton das Edições Anteriores */}
          <section className="mb-16">
            <div className="h-8 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg shadow p-4">
                  <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-1" />
                  <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : jornais.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
          <p className="text-lg text-muted-foreground">
            Nenhum jornal disponível no momento
          </p>
        </div>
      ) : (
        <>
          {/* Visualizador do Jornal Mais Recente */}
          <section className="mb-16">
            <Card className="shadow-medium overflow-hidden">
              <CardContent className="p-0">
                {/* Área de Visualização */}
                <div className="bg-muted flex items-center justify-center py-12 px-4">
                  <div className="max-w-3xl w-full">
                    <div className="aspect-[9/16] bg-background rounded-lg shadow-soft overflow-hidden relative">
                        {iframeCarregando && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-lg z-10">
                            <FileText className="w-16 h-16 text-muted-foreground animate-pulse mb-3" aria-hidden="true" />
                            <p className="text-sm text-muted-foreground animate-pulse">Carregando jornal...</p>
                          </div>
                        )}
                        <iframe
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                          }}
                          src={converterParaEmbed(jornalMaisRecente.url_pdf)}
                          title={jornalMaisRecente.titulo || "Jornal"}
                          allow="fullscreen"
                          onLoad={() => setIframeCarregando(false)}
                        ></iframe>
                      </div>
                  </div>
                </div>

                {/* Controles */}
                <div className="p-6 border-t border-border bg-background">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {jornalMaisRecente.titulo || "Última Edição"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {new Date(jornalMaisRecente.data + "T00:00:00").toLocaleDateString(
                          "pt-BR",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </p>
                    </div>
                    <a
                      href={jornalMaisRecente.url_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      Ver em Tela Cheia
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Edições Anteriores */}
          {jornais.length > 1 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Edições Anteriores</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {jornais.slice(1).map((jornal) => (
                  <a
                    key={jornal.id}
                    href={jornal.url_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="aspect-[3/4] bg-muted rounded-lg mb-3 overflow-hidden group-hover:scale-105 transition-transform relative">
                          <JornalThumbnail
                            src={converterParaEmbed(jornal.url_pdf)}
                            titulo={jornal.titulo || "Jornal"}
                          />
                        </div>
                        <p className="text-sm font-semibold text-center mb-1 line-clamp-2">
                          {jornal.titulo || "Jornal"}
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                          {new Date(jornal.data + "T00:00:00").toLocaleDateString(
                            "pt-BR",
                            { month: "short", year: "numeric" }
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      )}

        </div>
      </div>
    </div>
  );
}
