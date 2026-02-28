import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon
} from "lucide-react";
import { versiculoService } from "@/services/versiculoService";
import { Versiculo } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

export default function AdminVersiculosContent() {
  const [versiculos, setVersiculos] = useState<Versiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Form state
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [urlPost, setUrlPost] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    carregarVersiculos();
  }, []);

  const carregarVersiculos = async () => {
    setLoading(true);
    const dados = await versiculoService.getTodosVersiculos();
    setVersiculos(dados);
    setLoading(false);
  };

  const limparForm = () => {
    setEditandoId(null);
    setUrlPost("");
    setUrlImagem("");
    setTitulo("");
    setData("");
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data) {
      toast.error("Campo obrigatório faltando", {
        description: "A data é obrigatória!"
      });
      return;
    }

    setSalvando(true);

    const resultado = editandoId
      ? await versiculoService.atualizarVersiculo(editandoId, urlPost, urlImagem, titulo, data)
      : await versiculoService.criarVersiculo(urlPost, urlImagem, titulo, data);

    if (resultado.success) {
      toast.success(editandoId ? "Versículo atualizado!" : "Versículo criado!", {
        description: editandoId
          ? "O versículo foi atualizado com sucesso."
          : "O versículo foi criado com sucesso."
      });
      limparForm();
      carregarVersiculos();
    } else {
      toast.error("Erro ao salvar versículo", {
        description: resultado.error
      });
    }

    setSalvando(false);
  };

  const handleEditar = (versiculo: Versiculo) => {
    setEditandoId(versiculo.id);
    setUrlPost(versiculo.url_post);
    setUrlImagem(versiculo.url_imagem || "");
    setTitulo(versiculo.titulo || "");
    setData(versiculo.data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletar = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este versículo?")) return;

    const resultado = await versiculoService.deletarVersiculo(id);

    if (resultado.success) {
      toast.success("Versículo deletado!", {
        description: "O versículo foi deletado com sucesso."
      });
      carregarVersiculos();
    } else {
      toast.error("Erro ao deletar versículo", {
        description: resultado.error
      });
    }
  };

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    const resultado = await versiculoService.toggleAtivo(id, !ativo);

    if (resultado.success) {
      toast.success(ativo ? "Versículo desativado!" : "Versículo ativado!", {
        description: ativo
          ? "O versículo foi desativado com sucesso."
          : "O versículo foi ativado com sucesso."
      });
      carregarVersiculos();
    } else {
      toast.error("Erro ao alterar status", {
        description: resultado.error
      });
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Administração de Versículos
        </h1>

        {/* Formulário */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editandoId ? "Editar Versículo" : "Adicionar Novo Versículo"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <Label htmlFor="urlImagem">URL da Imagem *</Label>
                <div className="flex gap-2">
                  <ImageIcon className="w-5 h-5 text-muted-foreground mt-2" />
                  <Input
                    id="urlImagem"
                    type="url"
                    placeholder="https://..."
                    value={urlImagem}
                    onChange={(e) => setUrlImagem(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cole a URL direta da imagem do versículo
                </p>
              </div>

              <div>
                <Label htmlFor="urlPost">URL do Post do Facebook (opcional)</Label>
                <div className="flex gap-2">
                  <LinkIcon className="w-5 h-5 text-muted-foreground mt-2" />
                  <Input
                    id="urlPost"
                    type="url"
                    placeholder="https://www.facebook.com/..."
                    value={urlPost}
                    onChange={(e) => setUrlPost(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Link para o post original no Facebook (para compartilhamento)
                </p>
              </div>

              <div>
                <Label htmlFor="titulo">Título (opcional)</Label>
                <Input
                  id="titulo"
                  type="text"
                  placeholder="Ex: João 3:16 - O amor de Deus"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="data">Data *</Label>
                <div className="flex gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-2" />
                  <Input
                    id="data"
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={salvando}>
                  {salvando ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {editandoId ? "Atualizar" : "Adicionar"}
                    </>
                  )}
                </Button>

                {editandoId && (
                  <Button type="button" variant="outline" onClick={limparForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Versículos */}
        <Card>
          <CardHeader>
            <CardTitle>Versículos Cadastrados ({versiculos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {versiculos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum versículo cadastrado ainda.
              </p>
            ) : (
              <div className="space-y-4">
                {versiculos.map((versiculo) => (
                  <div
                    key={versiculo.id}
                    className={`p-4 border rounded-lg ${
                      !versiculo.ativo ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      {/* Miniatura da imagem */}
                      {versiculo.url_imagem && (
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={versiculo.url_imagem}
                            alt={versiculo.titulo || "Versículo"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {new Date(versiculo.data + 'T00:00:00').toLocaleDateString("pt-BR")}
                          </span>
                          {!versiculo.ativo && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              Inativo
                            </span>
                          )}
                        </div>

                        {versiculo.titulo && (
                          <h3 className="font-semibold mb-2">{versiculo.titulo}</h3>
                        )}

                        {versiculo.url_post && (
                          <a
                            href={versiculo.url_post}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all"
                          >
                            Ver no Facebook
                          </a>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleAtivo(versiculo.id, versiculo.ativo)}
                          title={versiculo.ativo ? "Desativar" : "Ativar"}
                        >
                          {versiculo.ativo ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditar(versiculo)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletar(versiculo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Como obter a URL da imagem:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Abra a imagem do versículo no Facebook</li>
              <li>Clique com o botão direito na imagem</li>
              <li>Selecione "Copiar endereço da imagem"</li>
              <li>Cole a URL no campo "URL da Imagem"</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-3">
              Dica: Você também pode usar qualquer URL de imagem válida (ex: Imgur, Google Drive público, etc.)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

