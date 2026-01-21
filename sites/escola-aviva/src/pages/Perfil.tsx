import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, BookOpen, Trophy, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CourseProgress } from '@/types/user';

export default function Perfil() {
  const { profile, user } = useAuth();
  const [coursesProgress, setCoursesProgress] = useState<CourseProgress[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCoursesProgress();
    }
  }, [user]);

  const fetchCoursesProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_accessed', { ascending: false });

      if (error) throw error;
      setCoursesProgress(data as CourseProgress[] || []);
    } catch (err) {
      console.error('Erro ao buscar progresso:', err);
    } finally {
      setLoadingProgress(false);
    }
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
      month: 'long',
      year: 'numeric',
    });
  };

  const totalCourses = coursesProgress.length;
  const completedCourses = coursesProgress.filter(c => c.completed_at).length;
  const avgProgress = totalCourses > 0
    ? Math.round(coursesProgress.reduce((acc, c) => acc + c.progress_percentage, 0) / totalCourses)
    : 0;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe seu progresso na Escola Aviva
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="icon-container-sm bg-blue-500/10">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalCourses}</p>
                    <p className="text-sm text-muted-foreground">Cursos matriculados</p>
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
                  <div className="icon-container-sm bg-green-500/10">
                    <Trophy className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedCourses}</p>
                    <p className="text-sm text-muted-foreground">Cursos concluidos</p>
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
                  <div className="icon-container-sm bg-amber-500/10">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{avgProgress}%</p>
                    <p className="text-sm text-muted-foreground">Progresso medio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informacoes Pessoais</CardTitle>
                <CardDescription>Seus dados cadastrados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-xl gradient-hero text-primary-foreground">
                      {getInitials(profile?.nome || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Nome</p>
                      <p className="font-medium">{profile?.nome}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-xs text-muted-foreground">Tipo de conta</p>
                      <p className="font-medium capitalize">{profile?.role === 'admin' ? 'Administrador' : 'Aluno'}</p>
                    </div>
                    <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                      {profile?.role === 'admin' ? 'Admin' : 'Aluno'}
                    </Badge>
                  </div>

                  {profile?.created_at && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Membro desde</p>
                      <p className="font-medium">{formatDate(profile.created_at)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Courses Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Progresso dos Cursos</CardTitle>
                <CardDescription>Acompanhe seu aprendizado</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingProgress ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : coursesProgress.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      Voce ainda nao esta matriculado em nenhum curso
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coursesProgress.map((course) => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm truncate">
                            {course.course_title}
                          </span>
                          <div className="flex items-center gap-2">
                            {course.completed_at && (
                              <Badge variant="outline" className="text-xs text-green-600">
                                Concluido
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {course.progress_percentage}%
                            </span>
                          </div>
                        </div>
                        <Progress value={course.progress_percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {course.lessons_completed} de {course.total_lessons} aulas
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
