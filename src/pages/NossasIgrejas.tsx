import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useState } from "react";

// Dados das igrejas - SUBSTITUA com os dados reais
const churches = [
  {
    id: 1,
    name: "Sede Central",
    neighborhood: "Jardim Esther",
    address: "Rua Lucas Padilha, 7 – Jd Esther",
    city: "São Paulo - SP, CEP 05366-080",
    phone: "(00) 00000-0000",
    schedule: "Aberto todos os dias as 18h",
    pastor: "Nome do Pastor(a)",
    position: { lat: -23.574401, lng: -46.758482 }, // Coordenadas do Jardim Esther, São Paulo
  },
  {
    id: 2,
    name: "Sede Norte",
    neighborhood: "Bairro Norte",
    address: "Rua Exemplo, 456 - Bairro Norte",
    city: "Cidade - Estado, CEP 00000-000",
    phone: "(00) 00000-0000",
    schedule: "Domingo: 09h e 19h\nQuarta: 19h30",
    pastor: "Nome do Pastor(a)",
    position: { lat: -23.5405, lng: -46.6233 },
  },
  {
    id: 3,
    name: "Sede Sul",
    neighborhood: "Bairro Sul",
    address: "Rua Exemplo, 789 - Bairro Sul",
    city: "Cidade - Estado, CEP 00000-000",
    phone: "(00) 00000-0000",
    schedule: "Domingo: 09h e 19h\nQuarta: 19h30",
    pastor: "Nome do Pastor(a)",
    position: { lat: -23.5605, lng: -46.6433 },
  },
];

export default function NossasIgrejas() {
  const [selectedChurch, setSelectedChurch] = useState<number | null>(null);

  // IMPORTANTE: Substitua pela sua chave da API do Google Maps
  const GOOGLE_MAPS_API_KEY = "AIzaSyCkN8txAwSMXcQUYln22XKt1kDP9P8RDuY";

  // Calcular centro do mapa baseado em todas as igrejas
  const centerMap = {
    lat:
      churches.reduce((sum, church) => sum + church.position.lat, 0) /
      churches.length,
    lng:
      churches.reduce((sum, church) => sum + church.position.lng, 0) /
      churches.length,
  };
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Nossas Igrejas
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Encontre a sede mais próxima de você e venha nos visitar
        </p>
      </div>

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
                  {churches.map((church) => (
                    <AdvancedMarker
                      key={church.id}
                      position={church.position}
                      onClick={() => setSelectedChurch(church.id)}
                    >
                      <Pin
                        background={
                          selectedChurch === church.id ? "#8B5CF6" : "#6366F1"
                        }
                        borderColor={
                          selectedChurch === church.id ? "#7C3AED" : "#4F46E5"
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
        {churches.map((church) => (
          <Card
            key={church.id}
            className={`shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 ${
              selectedChurch === church.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedChurch(church.id)}
          >
            <CardContent className="p-0">
              {/* Imagem da Igreja */}
              <div className="aspect-video bg-gradient-hero rounded-t-lg flex items-center justify-center">
                <span className="text-xl text-primary-foreground font-semibold">
                  Foto da Igreja
                </span>
              </div>

              {/* Informações */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  {church.name} - {church.neighborhood}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Endereço
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {church.address}
                        <br />
                        {church.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Telefone
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {church.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Horários
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {church.schedule}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Pastor(a) Responsável:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {church.pastor}
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${church.position.lat},${church.position.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Ver no Google Maps
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
