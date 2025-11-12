import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";

export default function NossasIgrejas() {
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

      {/* Grid de Igrejas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((igreja) => (
          <Card
            key={igreja}
            className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
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
                  Sede {igreja} - Nome do Bairro
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Endereço
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Rua Exemplo, 123 - Bairro
                        <br />
                        Cidade - Estado, CEP 00000-000
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
                        (00) 00000-0000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Horários
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Domingo: 09h e 19h
                        <br />
                        Quarta: 19h30
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Pastor(a) Responsável:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Nome do Pastor(a)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seção de Mapa (Placeholder) */}
      <section className="mt-16">
        <Card className="shadow-medium">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Encontre-nos no Mapa
            </h2>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                [Área para incorporar mapa do Google Maps com todas as
                localizações]
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
