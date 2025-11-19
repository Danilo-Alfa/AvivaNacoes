import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit, Images } from "lucide-react";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import { toast } from "@/components/ui/sonner";
import {
  getTodasGalerias,
  criarGaleria,
  atualizarGaleria,
  deletarGaleria,
  type Galeria,
} from "@/services/galeriaService";

function AdminGaleriasContent() {
  const [galerias, setGalerias] = useState<Galeria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);

  // Formulário
  const [urlAlbum, setUrlAlbum] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [capaUrl, setCapaUrl] = useState("");

  useEffect(() => {
    carregarGalerias();
  }, []);

  const carregarGalerias = async () => {
    try {
      setLoading(true);
      const data = await getTodasGalerias();
      setGalerias(data);
    } catch (error) {
      console.error("Erro ao carregar galerias:", error);
      toast.error("Erro ao carregar galerias", {
        description: "Não foi possível carregar a lista de galerias. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!urlAlbum || !titulo || !data) {
      toast.error("Campos obrigatórios faltando", {
        description: "Por favor, preencha a URL do álbum, título e data"
      });
      return;
    }

    try {
      if (editando) {
        await atualizarGaleria(
          editando,
          urlAlbum,
          titulo,
          descricao || null,
          data,
          capaUrl || null
        );
        toast.success("Galeria atualizada!", {
          description: `A galeria "${titulo}" foi atualizada com sucesso.`
        });
      } else {
        await criarGaleria(
          urlAlbum,
          titulo,
          descricao || null,
          data,
          capaUrl || null
        );
        toast.success("Galeria criada!", {
          description: `A galeria "${titulo}" foi criada com sucesso.`
        });
      }

      // Limpar formulário
      setUrlAlbum("");
      setTitulo("");
      setDescricao("");
      setData(new Date().toISOString().split("T")[0]);
      setCapaUrl("");
      setEditando(null);

      // Recarregar lista
      carregarGalerias();
    } catch (error) {
      console.error("Erro ao salvar galeria:", error);
      toast.error("Erro ao salvar galeria", {
        description: "Não foi possível salvar a galeria. Tente novamente."
      });
    }
  };

  const handleEditar = (galeria: Galeria) => {
    setEditando(galeria.id);
    setUrlAlbum(galeria.url_album);
    setTitulo(galeria.titulo);
    setDescricao(galeria.descricao || "");
    setData(galeria.data);
    setCapaUrl(galeria.capa_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setEditando(null);
    setUrlAlbum("");
    setTitulo("");
    setDescricao("");
    setData(new Date().toISOString().split("T")[0]);
    setCapaUrl("");
  };

  const handleDeletar = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja deletar a galeria "${titulo}"?`)) {
      return;
    }

    try {
      await deletarGaleria(id);
      toast.success("Galeria deletada!", {
        description: `A galeria "${titulo}" foi deletada com sucesso.`
      });
      carregarGalerias();
    } catch (error) {
      console.error("Erro ao deletar galeria:", error);
      toast.error("Erro ao deletar galeria", {
        description: "Não foi possível deletar a galeria. Tente novamente."
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Galerias</h1>
        <p className="text-muted-foreground">
          Adicione e gerencie os álbuns de fotos da igreja
        </p>
      </div>

      {/* Formulário */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {editando ? "Editar Galeria" : "Adicionar Nova Galeria"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                type="text"
                placeholder="Ex: Culto de Ação de Graças 2025"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                placeholder="Breve descrição do evento ou momento..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="urlAlbum">URL do Álbum *</Label>
              <Input
                id="urlAlbum"
                type="url"
                placeholder="https://photos.app.goo.gl/..."
                value={urlAlbum}
                onChange={(e) => setUrlAlbum(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                📸 <strong>Google Photos:</strong> Cole o link compartilhável do álbum<br />
                📷 <strong>Flickr/Drive:</strong> Cole o link de visualização
              </p>
            </div>

            <div>
              <Label htmlFor="capaUrl">URL da Foto de Capa (opcional)</Label>
              <Input
                id="capaUrl"
                type="url"
                placeholder="https://exemplo.com/capa.jpg"
                value={capaUrl}
                onChange={(e) => setCapaUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Link direto de uma imagem para usar como thumbnail
              </p>
            </div>

            <div>
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editando ? "Atualizar" : "Adicionar"}
              </Button>
              {editando && (
                <Button type="button" variant="outline" onClick={handleCancelar}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Galerias */}
      <Card>
        <CardHeader>
          <CardTitle>Galerias Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">
              Carregando...
            </p>
          ) : galerias.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Nenhuma galeria cadastrada ainda
            </p>
          ) : (
            <div className="space-y-3">
              {galerias.map((galeria) => (
                <div
                  key={galeria.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Images className="w-5 h-5 text-primary mt-1 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">
                      {galeria.titulo}
                    </h3>
                    {galeria.descricao && (
                      <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                        {galeria.descricao}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mb-1">
                      Data: {new Date(galeria.data + "T00:00:00").toLocaleDateString("pt-BR")}
                    </p>
                    <a
                      href={galeria.url_album}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline break-all"
                    >
                      {galeria.url_album}
                    </a>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditar(galeria)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletar(galeria.id, galeria.titulo)}
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

export default function AdminGalerias() {
  return (
    <ProtectedAdmin>
      <AdminGaleriasContent />
    </ProtectedAdmin>
  );
}
