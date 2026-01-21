import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, Users, FileText, Download } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { VideoPlayer } from "@/components/courses/VideoPlayer";
import { LessonList, Lesson } from "@/components/courses/LessonList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCourseById } from "@/data/courses";

const CursoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const course = getCourseById(id || "");
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(
    course?.lessons[0] || null
  );

  if (!course) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Curso não encontrado
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

  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

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
                videoId={currentLesson.videoId} 
                title={currentLesson.title} 
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge-primary">
                    Aula {course.lessons.findIndex(l => l.id === currentLesson?.id) + 1} de {course.lessons.length}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
                  {currentLesson?.title}
                </h2>
                <p className="text-muted-foreground">
                  Duração: {currentLesson?.duration}
                </p>
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
                  {course.fullDescription}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="icon-container-sm mx-auto mb-2">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{course.instructor}</p>
                    <p className="text-xs text-muted-foreground">Instrutor</p>
                  </div>
                  <div className="text-center">
                    <div className="icon-container-sm mx-auto mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{course.duration}</p>
                    <p className="text-xs text-muted-foreground">Duração Total</p>
                  </div>
                  <div className="text-center">
                    <div className="icon-container-sm mx-auto mb-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{course.lessonsCount} aulas</p>
                    <p className="text-xs text-muted-foreground">Conteúdo</p>
                  </div>
                  <div className="text-center">
                    <div className="icon-container-sm mx-auto mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{course.level}</p>
                    <p className="text-xs text-muted-foreground">Nível</p>
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
                        <p className="text-xs text-muted-foreground">PDF • Em breve</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Materiais complementares serão disponibilizados em breve.
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
                  {course.lessons.filter(l => l.isCompleted).length} de {course.lessons.length} concluídas
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
    </MainLayout>
  );
};

export default CursoDetalhe;
