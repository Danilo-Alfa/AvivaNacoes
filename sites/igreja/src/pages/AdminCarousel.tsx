import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, ImageIcon, Eye, EyeOff, GripVertical } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  getTodasFotosCarousel,
  criarFotoCarousel,
  atualizarFotoCarousel,
  deletarFotoCarousel,
  type FotoCarousel,
} from "@/services/carouselService";

const DIAS_SEMANA = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

function formatarDataEvento(dataStr: string): string {
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  const date = new Date(ano, mes - 1, dia);
  const diaSemana = DIAS_SEMANA[date.getDay()];
  return `${diaSemana} (${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")})`;
}

export default function AdminCarouselContent() {
  const [fotos, setFotos] = useState<FotoCarousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);

  // Formulário
  const [urlImagem, setUrlImagem] = useState("");
  const [titulo, setTitulo] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [ordem, setOrdem] = useState(0);
  const [ativo, setAtivo] = useState(true);

  // Preview
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    carregarFotos();
  }, []);

  const carregarFotos = async () => {
    try {
      setLoading(true);
      const data = await getTodasFotosCarousel();
      setFotos(data);
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
      toast.error("Erro ao carregar fotos", {
        description:
          "Não foi possível carregar as fotos do carrossel. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!urlImagem) {
      toast.error("Campo obrigatório faltando", {
        description: "Por favor, preencha a URL da imagem.",
      });
      return;
    }

    try {
      if (editando) {
        await atualizarFotoCarousel(
          editando,
          urlImagem,
          titulo || null,
          dataEvento || null,
          linkUrl || null,
          ordem,
          ativo
        );
        toast.success("Foto atualizada!", {
          description: "A foto do carrossel foi atualizada com sucesso.",
        });
      } else {
        await criarFotoCarousel(
          urlImagem,
          titulo || null,
          dataEvento || null,
          linkUrl || null,
          ordem,
          ativo
        );
        toast.success("Foto adicionada!", {
          description: "A foto foi adicionada ao carrossel com sucesso.",
        });
      }

      limparFormulario();
      carregarFotos();
    } catch (error) {
      console.error("Erro ao salvar foto:", error);
      toast.error("Erro ao salvar foto", {
        description:
          "Não foi possível salvar a foto do carrossel. Tente novamente.",
      });
    }
  };

  const limparFormulario = () => {
    setEditando(null);
    setUrlImagem("");
    setTitulo("");
    setDataEvento("");
    setLinkUrl("");
    setOrdem(0);
    setAtivo(true);
    setPreviewError(false);
  };

  const handleEditar = (foto: FotoCarousel) => {
    setEditando(foto.id);
    setUrlImagem(foto.url_imagem);
    setTitulo(foto.titulo || "");
    setDataEvento(foto.data_evento || "");
    setLinkUrl(foto.link_url || "");
    setOrdem(foto.ordem);
    setAtivo(foto.ativo);
    setPreviewError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletar = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta foto do carrossel?")) {
      return;
    }

    try {
      await deletarFotoCarousel(id);
      toast.success("Foto deletada!", {
        description: "A foto foi removida do carrossel com sucesso.",
      });
      carregarFotos();
    } catch (error) {
      console.error("Erro ao deletar foto:", error);
      toast.error("Erro ao deletar foto", {
        description:
          "Não foi possível deletar a foto do carrossel. Tente novamente.",
      });
    }
  };

  const toggleAtivo = async (foto: FotoCarousel) => {
    try {
      await atualizarFotoCarousel(
        foto.id,
        foto.url_imagem,
        foto.titulo,
        foto.data_evento,
        foto.link_url,
        foto.ordem,
        !foto.ativo
      );
      toast.success(
        foto.ativo ? "Foto desativada" : "Foto ativada",
        {
          description: foto.ativo
            ? "A foto não será mais exibida no app."
            : "A foto voltará a ser exibida no app.",
        }
      );
      carregarFotos();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status");
    }
  };

  const fotosAtivas = fotos.filter((f) => f.ativo).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Carrossel</h1>
        <p className="text-muted-foreground">
          Adicione fotos que aparecerão no carrossel "Momentos da Semana" na
          tela inicial do app
        </p>
        <div className="flex gap-4 mt-3">
          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
            {fotos.length} foto{fotos.length !== 1 ? "s" : ""} no total
          </span>
          <span className="text-sm bg-green-500/10 text-green-600 px-3 py-1 rounded-full">
            {fotosAtivas} ativa{fotosAtivas !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Formulário */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {editando ? "Editar Foto" : "Adicionar Nova Foto"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="urlImagem">URL da Imagem *</Label>
              <Input
                id="urlImagem"
                type="url"
                placeholder="https://exemplo.com/foto.jpg"
                value={urlImagem}
                onChange={(e) => {
                  setUrlImagem(e.target.value);
                  setPreviewError(false);
                }}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Cole o link direto da imagem. Pode ser do Google Drive (link
                público), Imgur, Supabase Storage, etc.
              </p>
            </div>

            {/* Preview da imagem */}
            {urlImagem && (
              <div className="rounded-lg overflow-hidden border bg-muted/30">
                {previewError ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <p className="text-sm">
                      Não foi possível carregar a preview
                    </p>
                    <p className="text-xs">
                      Verifique se a URL é um link direto de imagem
                    </p>
                  </div>
                ) : (
                  <img
                    src={urlImagem}
                    alt="Preview"
                    className="w-full max-h-64 object-cover"
                    onError={() => setPreviewError(true)}
                  />
                )}
              </div>
            )}

            <div>
              <Label htmlFor="titulo">Título / Legenda (opcional)</Label>
              <Input
                id="titulo"
                type="text"
                placeholder="Ex: Equipe Sul de Minas"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dataEvento">Data do evento (opcional)</Label>
              <Input
                id="dataEvento"
                type="date"
                value={dataEvento}
                onChange={(e) => setDataEvento(e.target.value)}
              />
              {dataEvento && (
                <p className="text-xs text-primary mt-1 font-medium">
                  {formatarDataEvento(dataEvento)}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Aparece abaixo do título na legenda da foto
              </p>
            </div>

            <div>
              <Label htmlFor="linkUrl">Link ao clicar (opcional)</Label>
              <Input
                id="linkUrl"
                type="url"
                placeholder="https://exemplo.com/album-completo"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Se preenchido, o usuário será redirecionado ao clicar na foto
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ordem">Ordem de exibição</Label>
                <Input
                  id="ordem"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={ordem}
                  onChange={(e) => setOrdem(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Menor número aparece primeiro
                </p>
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ativo}
                    onChange={(e) => setAtivo(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Ativo no app</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editando ? "Atualizar" : "Adicionar"}
              </Button>
              {editando && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={limparFormulario}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Fotos */}
      <Card>
        <CardHeader>
          <CardTitle>Fotos do Carrossel</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">
              Carregando...
            </p>
          ) : fotos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma foto cadastrada ainda</p>
              <p className="text-sm mt-1">
                Adicione fotos acima para criar o carrossel
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {fotos.map((foto) => (
                <div
                  key={foto.id}
                  className={`flex items-center gap-4 p-3 border rounded-lg transition-colors ${
                    foto.ativo
                      ? "hover:bg-accent/50"
                      : "opacity-60 bg-muted/30"
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />

                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={foto.url_imagem}
                      alt={foto.titulo || "Foto"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">
                        {foto.titulo || "Sem título"}
                      </h3>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          foto.ativo
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {foto.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    {foto.data_evento && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatarDataEvento(foto.data_evento)}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      Ordem: {foto.ordem}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleAtivo(foto)}
                      title={foto.ativo ? "Desativar" : "Ativar"}
                    >
                      {foto.ativo ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditar(foto)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletar(foto.id)}
                    >
                      <Trash2 className="w-4 h-4" />
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

