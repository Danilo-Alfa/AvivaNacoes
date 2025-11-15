import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Share2, Loader2 } from "lucide-react";
import { versiculoService } from "@/services/versiculoService";
import { Versiculo } from "@/lib/supabase";

export default function VersiculoDoDia() {
  const [versiculoDoDia, setVersiculoDoDia] = useState<Versiculo | null>(null);
  const [versiculosAnteriores, setVersiculosAnteriores] = useState<Versiculo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarVersiculos();
  }, []);

  const carregarVersiculos = async () => {
    setLoading(true);
    const [doDia, anteriores] = await Promise.all([
      versiculoService.getVersiculoDoDia(),
      versiculoService.getVersiculosAnteriores(6),
    ]);

    setVersiculoDoDia(doDia);
    setVersiculosAnteriores(anteriores);
    setLoading(false);
  };

  // Função para extrair URL do embed do Facebook
  const getFacebookEmbedUrl = (url: string) => {
    const encodedUrl = encodeURIComponent(url);
    return `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500`;
  };

  const handleCompartilhar = async () => {
    if (!versiculoDoDia) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: versiculoDoDia.titulo || "Versículo do Dia",
          text: "Confira o versículo do dia!",
          url: versiculoDoDia.url_post,
        });
      } catch (error) {
        console.log("Erro ao compartilhar:", error);
      }
    } else {
      window.open(versiculoDoDia.url_post, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Versículo do Dia
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Alimente sua alma com a Palavra de Deus. Receba diariamente uma
          mensagem de fé e esperança.
        </p>
      </div>

      {/* Versículo Destaque */}
      <section className="mb-16">
        {versiculoDoDia ? (
          <Card className="shadow-medium max-w-3xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(versiculoDoDia.data + 'T00:00:00').toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {versiculoDoDia.titulo && (
                <h2 className="text-xl font-semibold mb-4 text-center">
                  {versiculoDoDia.titulo}
                </h2>
              )}

              {/* Facebook Post Embed */}
              <div className="flex justify-center">
                <div className="w-full max-w-xl">
                  <iframe
                    src={getFacebookEmbedUrl(versiculoDoDia.url_post)}
                    width="100%"
                    height="530"
                    style={{ border: "none", overflow: "hidden" }}
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-center gap-4 pt-6 border-t">
                <button
                  onClick={handleCompartilhar}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-medium max-w-3xl mx-auto">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Nenhum versículo disponível no momento.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Versículos Anteriores */}
      {versiculosAnteriores.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Versículos Anteriores
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {versiculosAnteriores.map((versiculo) => (
              <Card
                key={versiculo.id}
                className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => window.open(versiculo.url_post, "_blank")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(versiculo.data + 'T00:00:00').toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  {versiculo.titulo && (
                    <p className="text-sm font-semibold text-primary line-clamp-3">
                      {versiculo.titulo}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Clique para ver no Facebook
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="mb-16">
        <Card className="shadow-medium bg-gradient-hero max-w-3xl mx-auto">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary-foreground pb-2">
              Receba o Versículo Diariamente
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Siga-nos nas redes sociais para receber uma palavra de Deus todos
              os dias em seu feed.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://web.facebook.com/igrejaevangelicaaviva/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-background text-foreground font-semibold rounded-lg hover:bg-background/90 transition-colors"
              >
                Seguir no Facebook
              </a>
              <a
                href="https://www.instagram.com/igrejaavivanacoes/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary-foreground/10 text-primary-foreground font-semibold rounded-lg hover:bg-primary-foreground/20 transition-colors border-2 border-primary-foreground/20"
              >
                Seguir no Instagram
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sobre a Bíblia */}
      <section>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">A Palavra de Deus</h2>
          <p className="text-muted-foreground mb-4">
            A Bíblia Sagrada é a palavra viva de Deus, uma fonte inesgotável de
            sabedoria, conforto e direção para nossas vidas. Cada versículo
            carrega o poder transformador do Espírito Santo.
          </p>
          <p className="text-muted-foreground">
            Medite diariamente na Palavra e permita que ela renove sua mente e
            fortaleça sua fé.
          </p>
        </div>
      </section>
    </div>
  );
}
