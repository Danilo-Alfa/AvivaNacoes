import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { getIgrejasAtivas, type Igreja } from "@/services/igrejaService";

// Skeleton para card de igreja
function IgrejaCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NossasIgrejas() {
  const [igrejas, setIgrejas] = useState<Igreja[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChurch, setSelectedChurch] = useState<string | null>(null);

  useEffect(() => {
    const carregarIgrejas = async () => {
      try {
        const data = await getIgrejasAtivas();
        setIgrejas(data);
      } catch (error) {
        console.error("Erro ao carregar igrejas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarIgrejas();
  }, []);

  // Chave da API do Google Maps vinda das variáveis de ambiente
  const GOOGLE_MAPS_API_KEY =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    "AIzaSyCkN8txAwSMXcQUYln22XKt1kDP9P8RDuY";

  // Filtrar igrejas com coordenadas válidas para o mapa
  const igrejasComCoordenadas = igrejas.filter(
    (igreja) => igreja.latitude && igreja.longitude,
  );

  // Calcular centro do mapa baseado em todas as igrejas com coordenadas
  const centerMap =
    igrejasComCoordenadas.length > 0
      ? {
          lat:
            igrejasComCoordenadas.reduce(
              (sum, igreja) => sum + (igreja.latitude || 0),
              0,
            ) / igrejasComCoordenadas.length,
          lng:
            igrejasComCoordenadas.reduce(
              (sum, igreja) => sum + (igreja.longitude || 0),
              0,
            ) / igrejasComCoordenadas.length,
        }
      : { lat: -23.574401, lng: -46.758482 }; // Default: Jardim Esther, SP

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Nossas Igrejas
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Encontre a sede mais próxima de você e venha nos visitar
        </p>
      </div>

      {loading ? (
        <>
          {/* Skeleton do Mapa */}
          <section className="mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="h-[500px] w-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
          </section>
          {/* Skeleton dos Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <IgrejaCardSkeleton />
            <IgrejaCardSkeleton />
            <IgrejaCardSkeleton />
          </div>
        </>
      ) : (
        <>
          {/* Mapa Interativo */}
          <section className="mb-16">
            <Card className="shadow-medium overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[500px] w-full">
                  <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                    <Map
                      defaultCenter={centerMap}
                      defaultZoom={12}
                      mapId="church-map"
                      gestureHandling="cooperative"
                      disableDefaultUI={false}
                    >
                      {igrejasComCoordenadas.map((igreja) => (
                        <AdvancedMarker
                          key={igreja.id}
                          position={{
                            lat: igreja.latitude!,
                            lng: igreja.longitude!,
                          }}
                          onClick={() => setSelectedChurch(igreja.id)}
                          title={`Ver detalhes de ${igreja.nome}`}
                        >
                          <Pin
                            background={
                              selectedChurch === igreja.id
                                ? "#8B5CF6"
                                : "#6366F1"
                            }
                            borderColor={
                              selectedChurch === igreja.id
                                ? "#7C3AED"
                                : "#4F46E5"
                            }
                            glyphColor="#FFFFFF"
                          />
                        </AdvancedMarker>
                      ))}
                    </Map>
                  </APIProvider>
                </div>
              </CardContent>
            </Card>
            <p className="text-sm text-center text-muted-foreground mt-4">
              Clique nos marcadores para ver detalhes de cada igreja
            </p>
          </section>

          {/* Grid de Igrejas */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {igrejas.map((igreja) => (
              <Card
                key={igreja.id}
                className={`shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer h-full flex flex-col ${
                  selectedChurch === igreja.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedChurch(igreja.id)}
                role="button"
                tabIndex={0}
                aria-label={`Selecionar ${igreja.nome}${igreja.bairro ? ` - ${igreja.bairro}` : ""}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedChurch(igreja.id);
                  }
                }}
              >
                <CardContent className="p-0 flex flex-col flex-1">
                  {/* Imagem da Igreja */}
                  {igreja.imagem_url ? (
                    <img
                      src={igreja.imagem_url}
                      alt={igreja.nome}
                      width={400}
                      height={225}
                      loading="lazy"
                      decoding="async"
                      className="aspect-video w-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-hero rounded-t-lg flex items-center justify-center">
                      <span className="text-xl text-primary-foreground font-semibold">
                        {igreja.nome}
                      </span>
                    </div>
                  )}

                  {/* Informações */}
                  <div className="p-6 pb-6 flex flex-col gap-3 flex-1">
                    <h3 className="text-xl font-bold">
                      {igreja.nome}
                      {igreja.bairro ? ` - ${igreja.bairro}` : ""}
                    <div className="w-full h-0.5 bg-primary/30 my-4"></div>
                    </h3>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-3">
                        <MapPin
                          className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Endereço
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {igreja.endereco}
                            {igreja.cidade && (
                              <>
                                <br />
                                {igreja.cidade}
                                {igreja.cep ? `, CEP ${igreja.cep}` : ""}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {(igreja.telefone || igreja.whatsapp) && (
                        <div className="flex items-start gap-3">
                          <Phone
                            className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Telefone
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {igreja.telefone || igreja.whatsapp}
                            </p>
                          </div>
                        </div>
                      )}

                      {igreja.horarios && (
                        <div className="flex items-start gap-3">
                          <Clock
                            className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Horários
                            </p>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {igreja.horarios}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {igreja.pastor && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Pastor(a) Responsável:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {igreja.pastor}
                        </p>
                      </div>
                    )}

                    {igreja.latitude && igreja.longitude ? (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${igreja.latitude},${igreja.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto pt-4 block w-full text-center px-4 py-3 min-h-[48px] bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver no Google Maps
                      </a>
                    ) : (
                      <div className="mt-auto pt-4">
                        <span className="block w-full text-center px-4 py-3 min-h-[48px] bg-muted text-muted-foreground rounded-lg text-sm font-medium cursor-not-allowed">
                          Localização indisponível
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
