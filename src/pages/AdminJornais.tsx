import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, FileText } from "lucide-react";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import { toast } from "@/components/ui/sonner";
import {
  getTodosJornais,
  criarJornal,
  atualizarJornal,
  deletarJornal,
  type Jornal,
} from "@/services/jornalService";

function AdminJornaisContent() {
  const [jornais, setJornais] = useState<Jornal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);

  // Formulário
  const [urlPdf, setUrlPdf] = useState("");
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    carregarJornais();
  }, []);

  const carregarJornais = async () => {
    try {
      setLoading(true);
      const data = await getTodosJornais();
      setJornais(data);
    } catch (error) {
      console.error("Erro ao carregar jornais:", error);
      toast.error("Erro ao carregar jornais", {
        description: "Não foi possível carregar a lista de jornais. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!urlPdf || !data) {
      toast.error("Campos obrigatórios faltando", {
        description: "Por favor, preencha a URL do PDF e a data"
      });
      return;
    }

    try {
      if (editando) {
        await atualizarJornal(editando, urlPdf, titulo || null, data);
        toast.success("Jornal atualizado!", {
          description: `O jornal${titulo ? ` "${titulo}"` : ''} foi atualizado com sucesso.`
        });
      } else {
        await criarJornal(urlPdf, titulo || null, data);
        toast.success("Jornal criado!", {
          description: `O jornal${titulo ? ` "${titulo}"` : ''} foi criado com sucesso.`
        });
      }

      // Limpar formulário
      setUrlPdf("");
      setTitulo("");
      setData(new Date().toISOString().split("T")[0]);
      setEditando(null);

      // Recarregar lista
      carregarJornais();
    } catch (error) {
      console.error("Erro ao salvar jornal:", error);
      toast.error("Erro ao salvar jornal", {
        description: "Não foi possível salvar o jornal. Tente novamente."
      });
    }
  };

  const handleEditar = (jornal: Jornal) => {
    setEditando(jornal.id);
    setUrlPdf(jornal.url_pdf);
    setTitulo(jornal.titulo || "");
    setData(jornal.data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setEditando(null);
    setUrlPdf("");
    setTitulo("");
    setData(new Date().toISOString().split("T")[0]);
  };

  const handleDeletar = async (id: string, titulo: string | null) => {
    if (!confirm(`Tem certeza que deseja deletar o jornal${titulo ? ` "${titulo}"` : ''}?`)) {
      return;
    }

    try {
      await deletarJornal(id);
      toast.success("Jornal deletado!", {
        description: `O jornal${titulo ? ` "${titulo}"` : ''} foi deletado com sucesso.`
      });
      carregarJornais();
    } catch (error) {
      console.error("Erro ao deletar jornal:", error);
      toast.error("Erro ao deletar jornal", {
        description: "Não foi possível deletar o jornal. Tente novamente."
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Jornais</h1>
        <p className="text-muted-foreground">
          Adicione e gerencie os PDFs dos jornais da igreja
        </p>
      </div>

      {/* Formulário */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {editando ? "Editar Jornal" : "Adicionar Novo Jornal"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="urlPdf">URL do Jornal *</Label>
              <Input
                id="urlPdf"
                type="url"
                placeholder="https://exemplo.com/jornal.pdf"
                value={urlPdf}
                onChange={(e) => setUrlPdf(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                📄 <strong>PDFs:</strong> Cole a URL direta do arquivo (.pdf)<br />
                🎨 <strong>Canva:</strong> Cole qualquer link de visualização (será convertido automaticamente para embed)<br />
                📖 <strong>Issuu:</strong> Cole o link normal (será convertido automaticamente)
              </p>
            </div>

            <div>
              <Label htmlFor="titulo">Título (opcional)</Label>
              <Input
                id="titulo"
                type="text"
                placeholder="Ex: Jornal de Janeiro 2025"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
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

      {/* Lista de Jornais */}
      <Card>
        <CardHeader>
          <CardTitle>Jornais Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">
              Carregando...
            </p>
          ) : jornais.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Nenhum jornal cadastrado ainda
            </p>
          ) : (
            <div className="space-y-3">
              {jornais.map((jornal) => (
                <div
                  key={jornal.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">
                      {jornal.titulo || "Sem título"}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1">
                      Data: {new Date(jornal.data + "T00:00:00").toLocaleDateString("pt-BR")}
                    </p>
                    <a
                      href={jornal.url_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline break-all"
                    >
                      {jornal.url_pdf}
                    </a>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditar(jornal)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletar(jornal.id, jornal.titulo)}
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

export default function AdminJornais() {
  return (
    <ProtectedAdmin>
      <AdminJornaisContent />
    </ProtectedAdmin>
  );
}
