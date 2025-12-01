import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, Folder, EyeOff } from "lucide-react";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import { toast } from "@/components/ui/sonner";
import {
  getTodosProjetos,
  criarProjeto,
  atualizarProjeto,
  deletarProjeto,
  type Projeto,
} from "@/services/projetoService";

function AdminProjetosContent() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);

  // Formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [publicoAlvo, setPublicoAlvo] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [comoParticipar, setComoParticipar] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [ordem, setOrdem] = useState(0);
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    carregarProjetos();
  }, []);

  const carregarProjetos = async () => {
    try {
      setLoading(true);
      const data = await getTodosProjetos();
      setProjetos(data);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      toast.error("Erro ao carregar projetos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome) {
      toast.error("Campo obrigatório faltando", {
        description: "Por favor, preencha o nome do projeto",
      });
      return;
    }

    try {
      if (editando) {
        await atualizarProjeto(
          editando,
          nome,
          descricao || null,
          categoria || null,
          objetivo || null,
          publicoAlvo || null,
          frequencia || null,
          comoParticipar || null,
          imagemUrl || null,
          ordem,
          ativo
        );
        toast.success("Projeto atualizado!");
      } else {
        await criarProjeto(
          nome,
          descricao || null,
          categoria || null,
          objetivo || null,
          publicoAlvo || null,
          frequencia || null,
          comoParticipar || null,
          imagemUrl || null,
          ordem,
          ativo
        );
        toast.success("Projeto criado!");
      }

      limparFormulario();
      carregarProjetos();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar projeto");
    }
  };

  const limparFormulario = () => {
    setNome("");
    setDescricao("");
    setCategoria("");
    setObjetivo("");
    setPublicoAlvo("");
    setFrequencia("");
    setComoParticipar("");
    setImagemUrl("");
    setOrdem(0);
    setAtivo(true);
    setEditando(null);
  };

  const handleEditar = (item: Projeto) => {
    setEditando(item.id);
    setNome(item.nome);
    setDescricao(item.descricao || "");
    setCategoria(item.categoria || "");
    setObjetivo(item.objetivo || "");
    setPublicoAlvo(item.publico_alvo || "");
    setFrequencia(item.frequencia || "");
    setComoParticipar(item.como_participar || "");
    setImagemUrl(item.imagem_url || "");
    setOrdem(item.ordem);
    setAtivo(item.ativo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletar = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${nome}"?`)) return;

    try {
      await deletarProjeto(id);
      toast.success("Projeto deletado!");
      carregarProjetos();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar projeto");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Projetos</h1>
        <p className="text-muted-foreground">
          Adicione, edite ou remova projetos sociais
        </p>
      </div>

      {/* Formulário */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editando ? "Editar Projeto" : "Novo Projeto"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nome">Nome do Projeto *</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Projeto Vida Nova"
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ex: Projeto Social, Educação, Evangelismo"
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
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descrição detalhada do projeto..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="objetivo">Objetivo Principal</Label>
                <Input
                  id="objetivo"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  placeholder="Ex: Ajudar famílias carentes"
                />
              </div>

              <div>
                <Label htmlFor="publicoAlvo">Público-Alvo</Label>
                <Input
                  id="publicoAlvo"
                  value={publicoAlvo}
                  onChange={(e) => setPublicoAlvo(e.target.value)}
                  placeholder="Ex: Famílias da região"
                />
              </div>

              <div>
                <Label htmlFor="frequencia">Frequência</Label>
                <Input
                  id="frequencia"
                  value={frequencia}
                  onChange={(e) => setFrequencia(e.target.value)}
                  placeholder="Ex: Semanal, Mensal"
                />
              </div>

              <div>
                <Label htmlFor="imagemUrl">URL da Imagem</Label>
                <Input
                  id="imagemUrl"
                  value={imagemUrl}
                  onChange={(e) => setImagemUrl(e.target.value)}
                  placeholder="https://exemplo.com/foto-projeto.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="comoParticipar">Como Participar/Doar</Label>
                <Textarea
                  id="comoParticipar"
                  value={comoParticipar}
                  onChange={(e) => setComoParticipar(e.target.value)}
                  placeholder="Informações sobre como as pessoas podem participar ou ajudar..."
                  rows={2}
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
                    Projeto ativo (visível na página pública)
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editando ? "Atualizar" : "Criar"} Projeto
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
          <CardTitle>Projetos Cadastrados ({projetos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : projetos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum projeto cadastrado
            </p>
          ) : (
            <div className="space-y-3">
              {projetos.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 flex items-start justify-between gap-4 hover:bg-accent/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Folder className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{item.nome}</span>
                      {item.categoria && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {item.categoria}
                        </span>
                      )}
                      {!item.ativo && (
                        <span className="text-xs bg-gray-500/20 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          Inativo
                        </span>
                      )}
                    </div>
                    {item.descricao && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {item.descricao}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {item.publico_alvo && <span>👥 {item.publico_alvo}</span>}
                      {item.frequencia && <span>📅 {item.frequencia}</span>}
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

export default function AdminProjetos() {
  return (
    <ProtectedAdmin>
      <AdminProjetosContent />
    </ProtectedAdmin>
  );
}
