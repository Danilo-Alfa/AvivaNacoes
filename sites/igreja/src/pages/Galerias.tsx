import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Images, ExternalLink } from "lucide-react";
import { getUltimasGalerias, type Galeria } from "@/services/galeriaService";

export default function Galerias() {
  const [galerias, setGalerias] = useState<Galeria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarGalerias();
  }, []);

  const carregarGalerias = async () => {
    try {
      setLoading(true);
      const data = await getUltimasGalerias();
      setGalerias(data);
    } catch (error) {
      console.error("Erro ao carregar galerias:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Galerias de Fotos
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Reviva os melhores momentos da nossa igreja
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Carregando galerias...</p>
        </div>
      ) : galerias.length === 0 ? (
        <div className="text-center py-20">
          <Images className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            Nenhuma galeria disponível no momento
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galerias.map((galeria) => (
            <a
              key={galeria.id}
              href={galeria.url_album}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer group overflow-hidden h-full">
                <CardContent className="p-0">
                  {/* Capa da Galeria */}
                  <div className="aspect-video bg-gradient-hero relative overflow-hidden">
                    {galeria.capa_url ? (
                      <img
                        src={galeria.capa_url}
                        alt={galeria.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Images className="w-16 h-16 text-primary-foreground" />
                      </div>
                    )}
                    {/* Overlay com ícone de link externo */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2">
                      {galeria.titulo}
                    </h3>
                    {galeria.descricao && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {galeria.descricao}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(galeria.data + "T00:00:00").toLocaleDateString(
                        "pt-BR",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
