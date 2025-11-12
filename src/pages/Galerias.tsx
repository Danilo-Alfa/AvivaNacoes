import { Card, CardContent } from "@/components/ui/card";
import { Folder, Image as ImageIcon } from "lucide-react";

export default function Galerias() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
          Galerias de Fotos
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Reviva os melhores momentos da nossa igreja
        </p>
      </div>

      {/* Grid de Pastas/Álbuns */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          "Cultos 2024",
          "Eventos Especiais",
          "Batismos",
          "Projetos Sociais",
          "Conferências",
          "Acampamentos",
          "Culto de Jovens",
          "Natal 2023",
          "Páscoa 2024",
          "Aniversário da Igreja",
          "Casamentos",
          "Inaugurações"
        ].map((album, index) => (
          <Card 
            key={album} 
            className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer group"
          >
            <CardContent className="p-6">
              <div className="aspect-square bg-gradient-hero rounded-lg mb-4 flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                <Folder className="w-16 h-16 text-primary-foreground mb-2" />
                <div className="flex items-center gap-1 text-primary-foreground/80 text-sm">
                  <ImageIcon className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 50) + 10} fotos</span>
                </div>
              </div>
              <h3 className="font-semibold text-center text-sm">{album}</h3>
              <p className="text-xs text-center text-muted-foreground mt-1">
                {new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Últimas Fotos Adicionadas */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Últimas Fotos Adicionadas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <Card 
              key={index}
              className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer overflow-hidden group"
            >
              <CardContent className="p-0">
                <div className="aspect-square bg-muted flex items-center justify-center group-hover:bg-muted/70 transition-colors">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Momentos Especiais</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((destaque) => (
            <Card key={destaque} className="shadow-medium overflow-hidden group cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-xl text-accent-foreground font-semibold">
                    Foto em Destaque
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Título do Momento Especial</h3>
                  <p className="text-sm text-muted-foreground">
                    Descrição do momento especial capturado nesta foto, explicando o contexto e a importância deste registro.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
