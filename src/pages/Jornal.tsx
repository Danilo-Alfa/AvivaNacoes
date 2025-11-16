import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { getUltimosJornais, type Jornal } from "@/services/jornalService";

export default function Jornal() {
  const [jornais, setJornais] = useState<Jornal[]>([]);
  const [loading, setLoading] = useState(true);

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
    // Canva: converte /view para /view?embed
    if (url.includes("canva.com/design/") && url.includes("/view")) {
      // Remove parâmetros existentes e adiciona ?embed
      const urlBase = url.split("?")[0];
      return `${urlBase}?embed`;
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
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Jornal Aviva News
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Acompanhe as notícias, reflexões e atualizações da nossa igreja
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Carregando jornais...</p>
        </div>
      ) : jornais.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
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
                {/* Área de Visualização - PDF Embed */}
                <div className="bg-muted flex items-center justify-center py-12 px-4">
                  <div className="max-w-3xl w-full">
                    <div className="aspect-[9/16] bg-background rounded-lg shadow-soft overflow-hidden">
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
                      <Download className="w-4 h-4" />
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
                        <div className="aspect-[3/4] bg-gradient-hero rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <FileText className="w-12 h-12 text-primary-foreground" />
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
  );
}
