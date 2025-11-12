import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Share2 } from "lucide-react";

export default function VersiculoDoDia() {
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
        <Card className="shadow-medium max-w-3xl mx-auto">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>

            {/* Facebook Post Embed */}
            <div className="flex justify-center">
              <div className="w-full max-w-xl">
                <iframe
                  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fweb.facebook.com%2Fapostolorowilson%2Fposts%2Fpfbid02mpY4HVNWitrmPwpofe2y9ferSGyPvtdGpcttbXH1Pb9syLQopQnu58tPFMM6nJKTl&show_text=true&width=500"
                  width="100%"
                  height="530"
                  style={{ border: "none", overflow: "hidden"}}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>

            {/* Ações */}
            <div className="flex justify-center gap-4 pt-6 border-t">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Versículos Anteriores */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Versículos Anteriores
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(Date.now() - (index + 1) * 86400000).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <blockquote className="text-sm mb-4 italic text-muted-foreground line-clamp-4">
                  "Porque Deus amou o mundo de tal maneira que deu o seu Filho
                  unigênito, para que todo aquele que nele crê não pereça, mas
                  tenha a vida eterna."
                </blockquote>
                <p className="text-sm font-semibold text-primary">João 3:16</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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
                href="https://www.instagram.com/igrejaavinanacoes/"
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
