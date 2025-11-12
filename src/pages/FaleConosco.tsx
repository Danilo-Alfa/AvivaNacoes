import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function FaleConosco() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
          Fale Conosco
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Estamos aqui para ouvir você. Entre em contato conosco!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Formulário */}
        <div>
          <Card className="shadow-medium">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Envie sua Mensagem</h2>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input 
                    id="nome" 
                    placeholder="Seu nome completo"
                    className="h-11"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="seu@email.com"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input 
                      id="telefone" 
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto *</Label>
                  <Input 
                    id="assunto" 
                    placeholder="Sobre o que você quer falar?"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem *</Label>
                  <Textarea 
                    id="mensagem" 
                    placeholder="Escreva sua mensagem aqui..."
                    className="min-h-[150px] resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full h-11 bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90"
                >
                  Enviar Mensagem
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Campos marcados com * são obrigatórios
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Informações de Contato */}
        <div className="space-y-6">
          {/* Contatos Diretos */}
          <Card className="shadow-soft">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telefone</h3>
                    <p className="text-muted-foreground text-sm">(00) 0000-0000</p>
                    <p className="text-muted-foreground text-sm">(00) 00000-0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">E-mail</h3>
                    <p className="text-muted-foreground text-sm">contato@igrejaaviva.com.br</p>
                    <p className="text-muted-foreground text-sm">secretaria@igrejaaviva.com.br</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Endereço - Sede Principal</h3>
                    <p className="text-muted-foreground text-sm">
                      Rua Exemplo, 123 - Bairro Centro<br />
                      Cidade - Estado<br />
                      CEP 00000-000
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Horário de Atendimento</h3>
                    <p className="text-muted-foreground text-sm">
                      Segunda a Sexta: 9h às 17h<br />
                      Sábado: 9h às 12h
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mapa */}
          <Card className="shadow-soft">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  [Mapa do Google Maps]
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociais */}
          <Card className="shadow-soft bg-gradient-hero">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-primary-foreground mb-4">
                Siga-nos nas Redes Sociais
              </h3>
              <p className="text-primary-foreground/90 mb-6 text-sm">
                Fique por dentro de tudo que acontece na nossa igreja
              </p>
              <div className="flex justify-center gap-4">
                {["Facebook", "Instagram", "YouTube", "WhatsApp"].map((rede) => (
                  <button
                    key={rede}
                    className="w-12 h-12 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-xs text-primary-foreground font-medium">
                      {rede[0]}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
