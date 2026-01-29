import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, Users, FileText, Download, Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { VideoPlayer } from "@/components/courses/VideoPlayer";
import { LessonList } from "@/components/courses/LessonList";
import { LessonCompleteButton } from "@/components/courses/LessonCompleteButton";
import { QuizModal } from "@/components/courses/QuizModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCourseBySlug } from "@/hooks/useCourse";
import { useMarkLessonComplete } from "@/hooks/useProgress";
import { toast } from "sonner";
import type { LessonWithProgress } from "@/types/course";

const CursoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading, error, refetch } = useCourseBySlug(id);
  const markComplete = useMarkLessonComplete();

  const [currentLesson, setCurrentLesson] = useState<LessonWithProgress | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);

  // Set initial lesson when course loads
  if (course && !currentLesson && course.lessons.length > 0) {
    // Find first unlocked lesson or default to first
    const firstUnlocked = course.lessons.find(l => !l.is_locked) || course.lessons[0];
    setCurrentLesson(firstUnlocked);
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-aviva-blue" />
          <p className="text-muted-foreground mt-4">Carregando curso...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !course) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Curso nao encontrado
          </h1>
          <Link to="/cursos">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Cursos
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleSelectLesson = (lesson: LessonWithProgress) => {
    if (!lesson.is_locked) {
      setCurrentLesson(lesson);
    }
  };

  const handleQuizRequired = () => {
    setQuizModalOpen(true);
  };

  const handleQuizComplete = async (passed: boolean) => {
    if (passed && currentLesson) {
      try {
        await markComplete.mutateAsync({
          lessonId: currentLesson.id,
          courseId: course.id,
        });
        toast.success("Aula concluida com sucesso!");
        refetch(); // Refresh course data to update progress

        // Auto-advance to next lesson
        const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
        if (currentIndex < course.lessons.length - 1) {
          const nextLesson = course.lessons[currentIndex + 1];
          setCurrentLesson({ ...nextLesson, is_locked: false });
        }
      } catch (error) {
        console.error("Erro ao marcar aula:", error);
        toast.error("Erro ao salvar progresso");
      }
    }
  };

  const handleLessonComplete = () => {
    refetch();
    // Auto-advance to next lesson
    if (currentLesson) {
      const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex < course.lessons.length - 1) {
        const nextLesson = course.lessons[currentIndex + 1];
        setCurrentLesson({ ...nextLesson, is_locked: false });
      }
    }
  };

  const currentLessonIndex = currentLesson
    ? course.lessons.findIndex(l => l.id === currentLesson.id)
    : 0;

  return (
    <MainLayout>
      {/* Back Button */}
      <Link to="/cursos" className="inline-block mb-6">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Cursos
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentLesson && (
              <VideoPlayer
                videoId={currentLesson.video_id}
                title={currentLesson.titulo}
              />
            )}
          </motion.div>

          {/* Current Lesson Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-soft">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-primary">
                        Aula {currentLessonIndex + 1} de {course.lessons_count}
                      </span>
                      {currentLesson?.has_quiz && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          Quiz
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
                      {currentLesson?.titulo}
                    </h2>
                    <p className="text-muted-foreground">
                      Duracao: {currentLesson?.duracao}
                    </p>
                  </div>

                  {currentLesson && (
                    <LessonCompleteButton
                      lessonId={currentLesson.id}
                      courseId={course.id}
                      hasQuiz={currentLesson.has_quiz}
                      isCompleted={currentLesson.is_completed}
                      onQuizRequired={handleQuizRequired}
                      onComplete={handleLessonComplete}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Course Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg font-display">Sobre o Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {course.descricao_completa}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="icon-container-sm mx-auto mb-2">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{course.instrutor}</p>
                    <p className="text-xs text-muted-foreground">Instrutor</p>
                  </div>
                  <div className="text-center">
                    <div className="icon-container-sm mx-auto mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{course.duracao_total}</p>
                    <p className="text-xs text-muted-foreground">Duracao Total</p>
                  </div>
                  <div className="text-center">
                    <div className="icon-container-sm mx-auto mb-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{course.lessons_count} aulas</p>
                    <p className="text-xs text-muted-foreground">Conteudo</p>
                  </div>
                  <div className="text-center">
                    <div className="icon-container-sm mx-auto mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{course.nivel}</p>
                    <p className="text-xs text-muted-foreground">Nivel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Materials Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Materiais de Apoio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">Apostila do Curso</p>
                        <p className="text-xs text-muted-foreground">PDF - Em breve</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Materiais complementares serao disponibilizados em breve.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar - Lessons List */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sticky top-6"
          >
            <Card className="shadow-soft">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-display">
                  Aulas do Curso
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {course.completed_lessons_count} de {course.lessons_count} concluidas
                </p>
              </CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto">
                <LessonList
                  lessons={course.lessons}
                  currentLessonId={currentLesson?.id || ""}
                  onSelectLesson={handleSelectLesson}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Quiz Modal */}
      {currentLesson && (
        <QuizModal
          open={quizModalOpen}
          onOpenChange={setQuizModalOpen}
          lessonId={currentLesson.id}
          lessonTitle={currentLesson.titulo}
          onQuizComplete={handleQuizComplete}
        />
      )}
    </MainLayout>
  );
};

export default CursoDetalhe;
