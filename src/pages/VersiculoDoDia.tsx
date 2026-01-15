import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Share2, Loader2, X, Maximize2, Sparkles, ArrowRight } from "lucide-react";
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
    <div>
      {/* Hero Section com onda */}
      <section className="relative bg-[linear-gradient(135deg,hsl(220,75%,35%)_0%,hsl(230,70%,45%)_50%,hsl(240,65%,55%)_100%)] overflow-hidden">
        {/* Ícones decorativos */}
        <div className="absolute top-8 left-8 text-white/20">
          <BookOpen className="w-16 h-16" />
        </div>
        <div className="absolute top-8 right-8 text-white/20">
          <Sparkles className="w-12 h-12" />
        </div>

        {/* Bolinhas decorativas animadas */}
        <style>{`
          @keyframes float1 {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes float2 {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(6px); }
          }
          @keyframes float3 {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}</style>
        <div className="absolute -left-16 top-1/3 w-48 h-48 bg-white/10 rounded-full" style={{ animation: 'float1 6s ease-in-out infinite' }} />
        <div className="absolute -right-24 top-1/4 w-64 h-64 bg-white/5 rounded-full" style={{ animation: 'float2 8s ease-in-out infinite' }} />
        <div className="absolute right-1/4 bottom-1/4 w-32 h-32 bg-white/10 rounded-full" style={{ animation: 'float3 7s ease-in-out infinite' }} />
        <div className="absolute left-1/3 top-1/4 w-20 h-20 bg-white/5 rounded-full" style={{ animation: 'float2 5s ease-in-out infinite' }} />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Palavra de Deus
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Versículos Inspiradores
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              "A palavra de Deus é viva e eficaz, e mais penetrante do que espada alguma de dois gumes."
            </p>
          </div>
        </div>

        {/* Onda SVG */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Versículo Destaque */}
      <section className="py-16 container mx-auto px-4">
        {versiculoDoDia ? (
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-card to-muted rounded-2xl shadow-medium overflow-hidden relative border border-border">
            {/* Aspas decorativas - mais afastadas no mobile */}
            <div className="absolute top-3 right-6 sm:top-0 sm:right-8 text-muted-foreground/20 pointer-events-none">
              <svg className="w-12 h-12 sm:w-20 sm:h-20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            <div className="p-6 md:p-8 relative z-10">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
                  Versículo do Dia
                </span>
              </div>

              {/* Imagem do Versículo */}
              {versiculoDoDia.url_imagem ? (
                <div className="relative group mb-4">
                  <img
                    src={versiculoDoDia.url_imagem}
                    alt={versiculoDoDia.titulo || "Versículo do dia"}
                    className="w-full rounded-xl cursor-pointer transition-transform hover:scale-[1.01] shadow-soft"
                    onClick={() => setImagemTelaCheia(versiculoDoDia.url_imagem)}
                  />
                  <button
                    onClick={() => setImagemTelaCheia(versiculoDoDia.url_imagem)}
                    className="absolute bottom-3 right-6 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Ver em tela cheia"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <p className="text-lg md:text-xl text-foreground font-medium mb-4">
                  {getTitulo(versiculoDoDia)}
                </p>
              )}

              {/* Referência */}
              <div className="flex items-center justify-between">
                <a
                  href={versiculoDoDia.url_post}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  — {getTitulo(versiculoDoDia)}
                </a>
                <button
                  onClick={handleCompartilhar}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
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
        <section className="py-12 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Versículos Anteriores
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {versiculosAnteriores.map((versiculo) => (
              <div
                key={versiculo.id}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                onClick={() => versiculo.url_imagem ? setImagemTelaCheia(versiculo.url_imagem) : window.open(versiculo.url_post, "_blank")}
              >
                {/* Aspas decorativas */}
                <div className="absolute -top-1 -right-1 sm:top-2 sm:right-7 text-primary/10 pointer-events-none">
                  <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>

                {/* Badge com Data */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                    {new Date(versiculo.data + 'T00:00:00').toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit"
                    })} - Versículo do Dia
                  </span>
                </div>

                {/* Imagem do Versículo */}
                {versiculo.url_imagem && (
                  <img
                    src={versiculo.url_imagem}
                    alt={versiculo.titulo || "Versículo"}
                    className="w-full rounded-xl mb-4"
                  />
                )}

                {/* Botão Facebook */}
                <a
                  href={versiculo.url_post}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Ver no Facebook
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[hsl(220,70%,45%)] to-[hsl(220,70%,35%)] rounded-2xl shadow-medium p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Receba o Versículo Diariamente
          </h2>
          <p className="text-white/80 mb-8">
            Siga-nos nas redes sociais para receber uma palavra de Deus todos os dias em seu feed.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Botão Facebook */}
            <a
              href="https://web.facebook.com/igrejaevangelicaaviva/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white text-foreground px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors group"
            >
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Seguir no Facebook
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Botão Instagram */}
            <a
              href="https://www.instagram.com/igrejaavivanacoes/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors group"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Seguir no Instagram
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Sobre a Bíblia */}
      <section className="py-12 container mx-auto px-4">
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
