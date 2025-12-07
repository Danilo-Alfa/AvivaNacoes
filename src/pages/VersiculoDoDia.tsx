import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Share2, Loader2, X, Maximize2 } from "lucide-react";
import { versiculoService } from "@/services/versiculoService";
import { Versiculo } from "@/lib/supabase";

export default function VersiculoDoDia() {
  const [versiculoDoDia, setVersiculoDoDia] = useState<Versiculo | null>(null);
  const [versiculosAnteriores, setVersiculosAnteriores] = useState<Versiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagemTelaCheia, setImagemTelaCheia] = useState<string | null>(null);

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

  const formatarTituloPadrao = (data: string) => {
    const dataObj = new Date(data + 'T00:00:00');
    const dia = dataObj.getDate();
    const mes = dataObj.toLocaleDateString("pt-BR", { month: "long" });
    return `Versículo do dia ${dia} de ${mes}`;
  };

  const getTitulo = (versiculo: Versiculo) => {
    return versiculo.titulo || formatarTituloPadrao(versiculo.data);
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

              <h2 className="text-xl font-semibold mb-4 text-center">
                {getTitulo(versiculoDoDia)}
              </h2>

              {/* Imagem do Versículo */}
              <div className="flex justify-center">
                <div className="w-full max-w-xl relative group">
                  {versiculoDoDia.url_imagem ? (
                    <>
                      <img
                        src={versiculoDoDia.url_imagem}
                        alt={versiculoDoDia.titulo || "Versículo do dia"}
                        className="w-full rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => setImagemTelaCheia(versiculoDoDia.url_imagem)}
                      />
                      <button
                        onClick={() => setImagemTelaCheia(versiculoDoDia.url_imagem)}
                        className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Ver em tela cheia"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <div className="bg-muted rounded-lg p-8 text-center">
                      <p className="text-muted-foreground">
                        Imagem não disponível.{" "}
                        <a
                          href={versiculoDoDia.url_post}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Ver no Facebook
                        </a>
                      </p>
                    </div>
                  )}
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
                className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
                onClick={() => versiculo.url_imagem ? setImagemTelaCheia(versiculo.url_imagem) : window.open(versiculo.url_post, "_blank")}
              >
                {versiculo.url_imagem && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={versiculo.url_imagem}
                      alt={versiculo.titulo || "Versículo"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(versiculo.data + 'T00:00:00').toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary line-clamp-2">
                    {getTitulo(versiculo)}
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

      {/* Modal Tela Cheia */}
      {imagemTelaCheia && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setImagemTelaCheia(null)}
        >
          <button
            onClick={() => setImagemTelaCheia(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            title="Fechar"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={imagemTelaCheia}
            alt="Versículo em tela cheia"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
