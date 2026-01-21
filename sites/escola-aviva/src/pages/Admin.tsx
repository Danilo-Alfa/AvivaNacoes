import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  Trophy,
  Search,
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  Calendar,
  UserPlus,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, CourseProgress, UserWithProgress } from '@/types/user';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEnrollments: 0,
    totalCompleted: 0,
  });

  // Estado para criar usuario
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    nome: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  });

  // Estado para alterar senha
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithProgress | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?select=*&order=created_at.desc`;
      const response = await fetch(url, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        }
      });
      const profiles = await response.json();

      const progressUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/course_progress?select=*`;
      const progressResponse = await fetch(progressUrl, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        }
      });
      const progress = await progressResponse.json();

      // Combinar os dados
      const usersWithProgress: UserWithProgress[] = (profiles || []).map((profile: UserProfile) => {
        const userProgress = (progress || []).filter((p: CourseProgress) => p.user_id === profile.id);
        return {
          ...profile,
          courses_progress: userProgress,
          total_courses_enrolled: userProgress.length,
          total_courses_completed: userProgress.filter((p: CourseProgress) => p.completed_at).length,
        };
      });

      setUsers(usersWithProgress);

      // Calcular estatisticas
      const totalEnrollments = (progress || []).length;
      const totalCompleted = (progress || []).filter((p: CourseProgress) => p.completed_at).length;

      setStats({
        totalUsers: profiles?.length || 0,
        totalEnrollments,
        totalCompleted,
      });
    } catch (err) {
      console.error('Erro ao buscar usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.nome || !newUser.email || !newUser.password) {
      toast({
        title: 'Campos obrigatorios',
        description: 'Preencha nome, email e senha.',
        variant: 'destructive',
      });
      return;
    }

    if (newUser.password.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);

    try {
      const response = await supabase.functions.invoke('create-user', {
        body: {
          email: newUser.email,
          password: newUser.password,
          nome: newUser.nome,
          role: newUser.role,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao criar usuario');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: 'Usuario criado!',
        description: `${newUser.nome} foi adicionado com sucesso.`,
      });

      // Limpar form e fechar dialog
      setNewUser({ nome: '', email: '', password: '', role: 'user' });
      setIsDialogOpen(false);

      // Recarregar lista
      fetchUsers();

    } catch (err: any) {
      toast({
        title: 'Erro ao criar usuario',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!selectedUser || !newPassword) {
      toast({
        title: 'Campos obrigatorios',
        description: 'Digite a nova senha.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setChangingPassword(true);

    try {
      const response = await supabase.functions.invoke('update-user-password', {
        body: {
          userId: selectedUser.id,
          newPassword: newPassword,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao alterar senha');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: 'Senha alterada!',
        description: `A senha de ${selectedUser.nome} foi alterada com sucesso.`,
      });

      // Limpar e fechar
      setNewPassword('');
      setSelectedUser(null);
      setIsPasswordDialogOpen(false);

    } catch (err: any) {
      toast({
        title: 'Erro ao alterar senha',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const openPasswordDialog = (user: UserWithProgress) => {
    setSelectedUser(user);
    setNewPassword('');
    setIsPasswordDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-bold mb-2">Acesso Restrito</h2>
              <p className="text-muted-foreground">
                Voce nao tem permissao para acessar esta pagina.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie usuarios e acompanhe o progresso dos alunos
            </p>
          </div>

          {/* Botao Criar Usuario */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Novo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Usuario</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar um novo usuario na plataforma.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    placeholder="Nome do usuario"
                    value={newUser.nome}
                    onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimo 6 caracteres"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de usuario</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: 'user' | 'admin') => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Aluno</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser} disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Usuario'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="icon-container bg-blue-500/10">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    <p className="text-sm text-muted-foreground">Total de usuarios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="icon-container bg-amber-500/10">
                    <BookOpen className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.totalEnrollments}</p>
                    <p className="text-sm text-muted-foreground">Matriculas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="icon-container bg-green-500/10">
                    <Trophy className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.totalCompleted}</p>
                    <p className="text-sm text-muted-foreground">Cursos concluidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Usuarios</CardTitle>
                  <CardDescription>
                    Lista de todos os usuarios cadastrados
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Nenhum usuario encontrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      layout
                      className="border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="gradient-hero text-primary-foreground">
                              {getInitials(user.nome)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{user.nome}</p>
                              {user.role === 'admin' && (
                                <Badge variant="secondary" className="text-xs">Admin</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">
                              {user.total_courses_enrolled} curso(s)
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.total_courses_completed} concluido(s)
                            </p>
                          </div>
                          {expandedUser === user.id ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {expandedUser === user.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t bg-muted/30 p-4"
                        >
                          <div className="grid gap-4 md:grid-cols-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              Cadastrado em {formatDate(user.created_at)}
                            </div>
                          </div>

                          {/* Botao Alterar Senha */}
                          <div className="mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPasswordDialog(user);
                              }}
                              className="gap-2"
                            >
                              <Key className="w-4 h-4" />
                              Alterar Senha
                            </Button>
                          </div>

                          {user.courses_progress.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              Este usuario ainda nao esta matriculado em nenhum curso
                            </p>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm font-medium">Progresso dos Cursos:</p>
                              {user.courses_progress.map((course) => (
                                <div key={course.id} className="bg-background p-3 rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">
                                      {course.course_title}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {course.progress_percentage}%
                                    </span>
                                  </div>
                                  <Progress value={course.progress_percentage} className="h-2" />
                                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                    <span>
                                      {course.lessons_completed}/{course.total_lessons} aulas
                                    </span>
                                    {course.completed_at && (
                                      <Badge variant="outline" className="text-xs text-green-600">
                                        Concluido
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Dialog Alterar Senha */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Alterar Senha</DialogTitle>
              <DialogDescription>
                Digite a nova senha para {selectedUser?.nome}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Minimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleChangePassword} disabled={changingPassword}>
                {changingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Senha'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
