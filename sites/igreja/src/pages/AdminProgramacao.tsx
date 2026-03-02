import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit, Clock, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  getTodaProgramacao,
  criarProgramacao,
  atualizarProgramacao,
  deletarProgramacao,
  DIAS_SEMANA,
  getNomeDiaSemana,
  type Programacao,
} from "@/services/programacaoService";

export default function AdminProgramacaoContent() {
  const [programacao, setProgramacao] = useState<Programacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);

  // Formulário
  const [titulo, setTitulo] = useState("");
  const [diaSemana, setDiaSemana] = useState<number>(0);
  const [horario, setHorario] = useState("");
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ordem, setOrdem] = useState(0);
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    carregarProgramacao();
  }, []);

  const carregarProgramacao = async () => {
    try {
      setLoading(true);
      const data = await getTodaProgramacao();
      setProgramacao(data);
    } catch (error) {
      console.error("Erro ao carregar programação:", error);
      toast.error("Erro ao carregar programação");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !horario) {
      toast.error("Campos obrigatórios faltando", {
        description: "Por favor, preencha título e horário",
      });
      return;
    }

    try {
      if (editando) {
        await atualizarProgramacao(
          editando,
          titulo,
          diaSemana,
          horario,
          local || null,
          descricao || null,
          ordem,
          ativo
        );
        toast.success("Atividade atualizada!");
      } else {
        await criarProgramacao(
          titulo,
          diaSemana,
          horario,
          local || null,
          descricao || null,
          ordem,
          ativo
        );
        toast.success("Atividade criada!");
      }

      limparFormulario();
      carregarProgramacao();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar atividade");
    }
  };

  const limparFormulario = () => {
    setTitulo("");
    setDiaSemana(0);
    setHorario("");
    setLocal("");
    setDescricao("");
    setOrdem(0);
    setAtivo(true);
    setEditando(null);
  };

  const handleEditar = (item: Programacao) => {
    setEditando(item.id);
    setTitulo(item.titulo);
    setDiaSemana(item.dia_semana);
    setHorario(item.horario);
    setLocal(item.local || "");
    setDescricao(item.descricao || "");
    setOrdem(item.ordem);
    setAtivo(item.ativo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletar = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${titulo}"?`)) return;

    try {
      await deletarProgramacao(id);
      toast.success("Atividade deletada!");
      carregarProgramacao();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar atividade");
    }
  };

  // Agrupar programação por dia
  const programacaoPorDia = DIAS_SEMANA.map((dia) => ({
    ...dia,
    atividades: programacao.filter((p) => p.dia_semana === dia.valor),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Programação</h1>
        <p className="text-muted-foreground">
          Adicione, edite ou remova atividades semanais
        </p>
      </div>

      {/* Formulário */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editando ? "Editar Atividade" : "Nova Atividade"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Culto de Domingo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="diaSemana">Dia da Semana *</Label>
                <Select
                  value={diaSemana.toString()}
                  onValueChange={(v) => setDiaSemana(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIAS_SEMANA.map((dia) => (
                      <SelectItem key={dia.valor} value={dia.valor.toString()}>
                        {dia.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="horario">Horário *</Label>
                <Input
                  id="horario"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  placeholder="Ex: 19h30"
                  required
                />
              </div>

              <div>
                <Label htmlFor="local">Local</Label>
                <Input
                  id="local"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  placeholder="Ex: Sede Principal"
                />
              </div>

              <div>
                <Label htmlFor="ordem">Ordem</Label>
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
                  placeholder="Descrição da atividade..."
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
                    Atividade ativa (visível na página pública)
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editando ? "Atualizar" : "Criar"} Atividade
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

      {/* Lista por Dia */}
      <Card>
        <CardHeader>
          <CardTitle>Programação Semanal ({programacao.length} atividades)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : (
            <div className="space-y-6">
              {programacaoPorDia.map((dia) => (
                <div key={dia.valor}>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {dia.nome}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({dia.atividades.length} atividades)
                    </span>
                  </h3>

                  {dia.atividades.length === 0 ? (
                    <p className="text-sm text-muted-foreground ml-6 mb-4">
                      Nenhuma atividade programada
                    </p>
                  ) : (
                    <div className="space-y-2 ml-6 mb-4">
                      {dia.atividades.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-3 flex items-center justify-between gap-4 hover:bg-accent/50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.titulo}</span>
                              <span className="text-sm text-muted-foreground">
                                • {item.horario}
                              </span>
                              {item.local && (
                                <span className="text-sm text-muted-foreground">
                                  • {item.local}
                                </span>
                              )}
                              {!item.ativo && (
                                <span className="text-xs bg-gray-500/20 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <EyeOff className="w-3 h-3" />
                                  Inativo
                                </span>
                              )}
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
                              onClick={() => handleDeletar(item.id, item.titulo)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

