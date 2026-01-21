import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, MapPin, EyeOff } from "lucide-react";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import { toast } from "@/components/ui/sonner";
import {
  getTodasIgrejas,
  criarIgreja,
  atualizarIgreja,
  deletarIgreja,
  type Igreja,
} from "@/services/igrejaService";

function AdminIgrejasContent() {
  const [igrejas, setIgrejas] = useState<Igreja[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);

  // Formulário
  const [nome, setNome] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [horarios, setHorarios] = useState("");
  const [pastor, setPastor] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [ordem, setOrdem] = useState(0);
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    carregarIgrejas();
  }, []);

  const carregarIgrejas = async () => {
    try {
      setLoading(true);
      const data = await getTodasIgrejas();
      setIgrejas(data);
    } catch (error) {
      console.error("Erro ao carregar igrejas:", error);
      toast.error("Erro ao carregar igrejas");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !endereco) {
      toast.error("Campos obrigatórios faltando", {
        description: "Por favor, preencha nome e endereço",
      });
      return;
    }

    try {
      const lat = latitude ? parseFloat(latitude) : null;
      const lng = longitude ? parseFloat(longitude) : null;

      if (editando) {
        await atualizarIgreja(
          editando,
          nome,
          bairro || null,
          endereco,
          cidade || null,
          cep || null,
          telefone || null,
          whatsapp || null,
          horarios || null,
          pastor || null,
          lat,
          lng,
          imagemUrl || null,
          ordem,
          ativo
        );
        toast.success("Igreja atualizada!");
      } else {
        await criarIgreja(
          nome,
          bairro || null,
          endereco,
          cidade || null,
          cep || null,
          telefone || null,
          whatsapp || null,
          horarios || null,
          pastor || null,
          lat,
          lng,
          imagemUrl || null,
          ordem,
          ativo
        );
        toast.success("Igreja criada!");
      }

      limparFormulario();
      carregarIgrejas();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar igreja");
    }
  };

  const limparFormulario = () => {
    setNome("");
    setBairro("");
    setEndereco("");
    setCidade("");
    setCep("");
    setTelefone("");
    setWhatsapp("");
    setHorarios("");
    setPastor("");
    setLatitude("");
    setLongitude("");
    setImagemUrl("");
    setOrdem(0);
    setAtivo(true);
    setEditando(null);
  };

  const handleEditar = (item: Igreja) => {
    setEditando(item.id);
    setNome(item.nome);
    setBairro(item.bairro || "");
    setEndereco(item.endereco);
    setCidade(item.cidade || "");
    setCep(item.cep || "");
    setTelefone(item.telefone || "");
    setWhatsapp(item.whatsapp || "");
    setHorarios(item.horarios || "");
    setPastor(item.pastor || "");
    setLatitude(item.latitude?.toString() || "");
    setLongitude(item.longitude?.toString() || "");
    setImagemUrl(item.imagem_url || "");
    setOrdem(item.ordem);
    setAtivo(item.ativo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletar = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${nome}"?`)) return;

    try {
      await deletarIgreja(id);
      toast.success("Igreja deletada!");
      carregarIgrejas();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar igreja");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Igrejas</h1>
        <p className="text-muted-foreground">
          Adicione, edite ou remova sedes da igreja
        </p>
      </div>

      {/* Formulário */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editando ? "Editar Igreja" : "Nova Igreja"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome da Sede *</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Sede Central"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Ex: Jardim Esther"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço Completo *</Label>
                <Input
                  id="endereco"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Ex: Rua Lucas Padilha, 7"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cidade">Cidade/Estado</Label>
                <Input
                  id="cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex: São Paulo - SP"
                />
              </div>

              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="Ex: 05366-080"
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Ex: (11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: (11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="pastor">Pastor Responsável</Label>
                <Input
                  id="pastor"
                  value={pastor}
                  onChange={(e) => setPastor(e.target.value)}
                  placeholder="Ex: Pr. João Silva"
                />
              </div>

              <div>
                <Label htmlFor="ordem">Ordem de Exibição</Label>
                <Input
                  id="ordem"
                  type="number"
                  value={ordem}
                  onChange={(e) => setOrdem(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="horarios">Horários de Funcionamento</Label>
                <Textarea
                  id="horarios"
                  value={horarios}
                  onChange={(e) => setHorarios(e.target.value)}
                  placeholder="Ex: Domingo: 09h e 19h | Quarta: 19h30"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="latitude">Latitude (para o mapa)</Label>
                <Input
                  id="latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Ex: -23.574401"
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitude (para o mapa)</Label>
                <Input
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Ex: -46.758482"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="imagemUrl">URL da Imagem</Label>
                <Input
                  id="imagemUrl"
                  value={imagemUrl}
                  onChange={(e) => setImagemUrl(e.target.value)}
                  placeholder="https://exemplo.com/foto-igreja.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ativo"
                    checked={ativo}
                    onCheckedChange={(checked) => setAtivo(checked as boolean)}
                  />
                  <Label htmlFor="ativo" className="cursor-pointer">
                    Igreja ativa (visível na página pública)
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editando ? "Atualizar" : "Criar"} Igreja
              </Button>
              {editando && (
                <Button type="button" variant="outline" onClick={limparFormulario}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Igrejas Cadastradas ({igrejas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : igrejas.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma igreja cadastrada
            </p>
          ) : (
            <div className="space-y-3">
              {igrejas.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 flex items-start justify-between gap-4 hover:bg-accent/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{item.nome}</span>
                      {item.bairro && (
                        <span className="text-sm text-muted-foreground">
                          - {item.bairro}
                        </span>
                      )}
                      {!item.ativo && (
                        <span className="text-xs bg-gray-500/20 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          Inativa
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.endereco}</p>
                    {item.cidade && (
                      <p className="text-sm text-muted-foreground">{item.cidade}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                      {item.telefone && <span>📞 {item.telefone}</span>}
                      {item.pastor && <span>👤 {item.pastor}</span>}
                      <span>🔢 Ordem: {item.ordem}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditar(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletar(item.id, item.nome)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminIgrejas() {
  return (
    <ProtectedAdmin>
      <AdminIgrejasContent />
    </ProtectedAdmin>
  );
}
