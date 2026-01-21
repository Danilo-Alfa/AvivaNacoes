import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users, Clock, Flame, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { CourseCard } from "@/components/courses/CourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { coursesData } from "@/data/courses";
import heroImage from "@/assets/hero-study.jpg";

const stats = [
  { icon: BookOpen, value: "3", label: "Cursos Disponíveis" },
  { icon: Users, value: "150+", label: "Alunos Matriculados" },
  { icon: Clock, value: "20h+", label: "Horas de Conteúdo" },
];

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative -mx-4 md:-mx-8 -mt-6 md:-mt-10 mb-12 md:mb-20">
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Escola Aviva - Formação Espiritual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/40" />
          </div>

          {/* Content */}
          <div className="relative h-full container-custom flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-sm font-semibold text-background/90 uppercase tracking-wider">
                  Escola Aviva
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-background mb-4 leading-tight">
                Formação Espiritual para uma Vida Transformada
              </h1>

              <p className="text-base md:text-lg text-background/80 mb-8 max-w-xl">
                Aprofunde sua fé através de vídeo-aulas, materiais de estudo e 
                uma comunidade comprometida com o crescimento espiritual.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/cursos">
                  <Button 
                    size="lg" 
                    className="gradient-hero btn-hover text-primary-foreground px-8 w-full sm:w-auto"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Começar Agora
                  </Button>
                </Link>
                <Link to="/sobre">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-background/10 border-background/30 text-background hover:bg-background/20 w-full sm:w-auto"
                  >
                    Saiba Mais
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative -mt-16 md:-mt-20"
          >
            <Card className="shadow-medium bg-card/95 backdrop-blur-sm border-border">
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-3 gap-4 md:gap-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="icon-container-sm md:icon-container mx-auto mb-2">
                        <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <p className="text-xl md:text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-3">
            Cursos em Destaque
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore nossos cursos de formação espiritual, preparados com carinho 
            para edificar sua fé e fortalecer seu caminhar com Cristo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {coursesData.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CourseCard {...course} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link to="/cursos">
            <Button variant="outline" size="lg" className="btn-hover">
              Ver Todos os Cursos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-medium overflow-hidden">
            <div className="gradient-accent">
              <CardContent className="p-6 md:p-12 text-center">
                <h2 className="text-2xl md:text-4xl font-display font-bold text-accent-foreground mb-4">
                  Pronto para Crescer na Fé?
                </h2>
                <p className="text-accent-foreground/80 max-w-xl mx-auto mb-8">
                  Junte-se a centenas de irmãos que estão aprofundando seu 
                  conhecimento bíblico e crescendo espiritualmente.
                </p>
                <Link to="/cursos">
                  <Button 
                    size="lg" 
                    className="bg-card text-foreground hover:bg-card/90 btn-hover px-8"
                  >
                    Começar Gratuitamente
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-12 pt-8 pb-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">
              Escola Aviva
            </span>
          </div>
          <p>© 2025 Escola Aviva. Formação Espiritual.</p>
        </div>
      </footer>
    </MainLayout>
  );
};

export default Index;
