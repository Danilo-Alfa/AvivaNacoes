import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { CourseCard } from "@/components/courses/CourseCard";
import { coursesData } from "@/data/courses";

const Cursos = () => {
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
            Descubra nossos cursos de formação espiritual. Cada módulo foi 
            preparado para edificar sua fé e aprofundar seu conhecimento bíblico.
          </p>
        </motion.div>
      </section>

      {/* Courses Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {coursesData.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CourseCard {...course} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Empty State Info */}
      {coursesData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-muted-foreground">
            Novos cursos em breve! Estamos preparando conteúdos incríveis para você.
          </p>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default Cursos;
