import ProtectedAdmin from "@/components/ProtectedAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import {
  atualizarJornal,
  criarJornal,
  deletarJornal,
  getTodosJornais,
  uploadPdfJornal,
  type Jornal,
} from "@/services/jornalService";
import { Edit, FileText, Trash2, Upload, Link, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

function AdminJornaisContent() {
  const [jornais, setJornais] = useState<Jornal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);

  // Formulário
  const [urlPdf, setUrlPdf] = useState("");
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [modoInput, setModoInput] = useState<"url" | "upload">("upload");
  const [arquivoPdf, setArquivoPdf] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
        description:
          "Não foi possível carregar a lista de jornais. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const temUrl = modoInput === "url" && urlPdf;
    const temArquivo = modoInput === "upload" && arquivoPdf;

    if (!temUrl && !temArquivo && !editando) {
      toast.error("Campos obrigatórios faltando", {
        description:
          modoInput === "upload"
            ? "Por favor, selecione um arquivo PDF"
            : "Por favor, preencha a URL do PDF",
      });
      return;
    }

    if (!data) {
      toast.error("Campos obrigatórios faltando", {
        description: "Por favor, preencha a data",
      });
      return;
    }

    try {
      let urlFinal = urlPdf;

      // Se tem arquivo para upload, faz o upload primeiro
      if (temArquivo && arquivoPdf) {
        setUploading(true);
        urlFinal = await uploadPdfJornal(arquivoPdf);
      }

      if (editando) {
        await atualizarJornal(editando, urlFinal || urlPdf, titulo || null, data);
        toast.success("Jornal atualizado!", {
          description: `O jornal${
            titulo ? ` "${titulo}"` : ""
          } foi atualizado com sucesso.`,
        });
      } else {
        await criarJornal(urlFinal, titulo || null, data);
        toast.success("Jornal criado!", {
          description: `O jornal${
            titulo ? ` "${titulo}"` : ""
          } foi criado com sucesso.`,
        });
      }

      // Limpar formulário
      setUrlPdf("");
      setTitulo("");
      setData(new Date().toISOString().split("T")[0]);
      setArquivoPdf(null);
      setEditando(null);

      // Recarregar lista
      carregarJornais();
    } catch (error) {
      console.error("Erro ao salvar jornal:", error);
      toast.error("Erro ao salvar jornal", {
        description: "Não foi possível salvar o jornal. Tente novamente.",
      });
    } finally {
      setUploading(false);
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
    setArquivoPdf(null);
  };

  const handleDeletar = async (id: string, titulo: string | null) => {
    if (
      !confirm(
        `Tem certeza que deseja deletar o jornal${
          titulo ? ` "${titulo}"` : ""
        }?`
      )
    ) {
      return;
    }

    try {
      await deletarJornal(id);
      toast.success("Jornal deletado!", {
        description: `O jornal${
          titulo ? ` "${titulo}"` : ""
        } foi deletado com sucesso.`,
      });
      carregarJornais();
    } catch (error) {
      console.error("Erro ao deletar jornal:", error);
      toast.error("Erro ao deletar jornal", {
        description: "Não foi possível deletar o jornal. Tente novamente.",
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
            {/* Seletor de modo: Upload ou URL */}
            <div>
              <Label className="mb-2 block">Como deseja adicionar o jornal? *</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={modoInput === "upload" ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setModoInput("upload"); setUrlPdf(""); }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar PDF
                </Button>
                <Button
                  type="button"
                  variant={modoInput === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setModoInput("url"); setArquivoPdf(null); }}
                >
                  <Link className="w-4 h-4 mr-2" />
                  Colar URL
                </Button>
              </div>
            </div>

            {modoInput === "upload" ? (
              <div>
                <Label htmlFor="arquivoPdf">Arquivo PDF *</Label>
                <div className="mt-1">
                  <label
                    htmlFor="arquivoPdf"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    {arquivoPdf ? (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="font-medium">{arquivoPdf.name}</span>
                        <span className="text-muted-foreground">
                          ({(arquivoPdf.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <span className="text-sm">Clique para selecionar o PDF</span>
                      </div>
                    )}
                    <input
                      id="arquivoPdf"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setArquivoPdf(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="urlPdf">URL do Jornal *</Label>
                <Input
                  id="urlPdf"
                  type="url"
                  placeholder="https://exemplo.com/jornal.pdf"
                  value={urlPdf}
                  onChange={(e) => setUrlPdf(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Cole a URL direta do PDF, link do Canva ou Issuu
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="titulo">Título (opcional)</Label>
              <Input
                id="titulo"
                type="text"
                placeholder="Ex: Jornal de Janeiro 2026"
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
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando PDF...
                  </>
                ) : editando ? (
                  "Atualizar"
                ) : (
                  "Adicionar"
                )}
              </Button>
              {editando && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelar}
                  disabled={uploading}
                >
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
                      Data:{" "}
                      {new Date(jornal.data + "T00:00:00").toLocaleDateString(
                        "pt-BR"
                      )}
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
