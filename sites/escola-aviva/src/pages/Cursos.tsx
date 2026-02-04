import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { CourseCard } from "@/components/courses/CourseCard";
import { useCourses } from "@/hooks/useCourses";
import { Loader2 } from "lucide-react";
import { normalizeImageUrl } from "@/lib/image-utils";

const Cursos = () => {
  const { data: courses, isLoading, error } = useCourses();

  return (
    <MainLayout>
      {/* Hero */}
      <section className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 gradient-text pb-2">
            Nossos Cursos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra nossos cursos de formacao espiritual. Cada modulo foi
            preparado para edificar sua fe e aprofundar seu conhecimento biblico.
          </p>
        </motion.div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-aviva-blue" />
          <p className="text-muted-foreground mt-4">Carregando cursos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-red-600 mb-2">Erro ao carregar cursos.</p>
          <p className="text-muted-foreground text-sm">
            Verifique sua conexao e tente novamente.
          </p>
        </motion.div>
      )}

      {/* Courses Grid */}
      {!isLoading && !error && courses && courses.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CourseCard
                  id={course.slug}
                  title={course.titulo}
                  description={course.descricao || ""}
                  thumbnail={normalizeImageUrl(course.thumbnail_url)}
                  instructor={course.instrutor || "Instrutor"}
                  duration={course.duracao_total || ""}
                  lessonsCount={course.lessons_count}
                  level={course.nivel || "Iniciante"}
                  isNew={course.is_novo}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State Info */}
      {!isLoading && !error && courses && courses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-muted-foreground">
            Novos cursos em breve! Estamos preparando conteudos incriveis para voce.
          </p>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default Cursos;
