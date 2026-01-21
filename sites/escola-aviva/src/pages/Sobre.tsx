import { motion } from "framer-motion";
import { Flame, Heart, Target, Users, BookOpen, Award } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-study.jpg";

const values = [
  {
    icon: BookOpen,
    title: "Ensino Bíblico",
    description: "Comprometidos com o ensino sólido e fundamentado nas Escrituras Sagradas.",
  },
  {
    icon: Heart,
    title: "Amor ao Próximo",
    description: "Formando discípulos que amam e servem sua comunidade com excelência.",
  },
  {
    icon: Target,
    title: "Propósito",
    description: "Ajudando cada aluno a descobrir e viver seu chamado em Cristo.",
  },
  {
    icon: Users,
    title: "Comunidade",
    description: "Construindo relacionamentos genuínos e edificantes entre os irmãos.",
  },
];

const team = [
  {
    name: "Pr. Carlos Silva",
    role: "Diretor Acadêmico",
    description: "Pastor há mais de 20 anos, dedicado ao ensino e formação de líderes.",
  },
  {
    name: "Pra. Ana Beatriz",
    role: "Coordenadora Espiritual",
    description: "Especialista em vida devocional e ministério de oração.",
  },
  {
    name: "Pr. Marcos Oliveira",
    role: "Professor de Teologia",
    description: "Mestre em Teologia com foco em estudos do Antigo Testamento.",
  },
];

const Sobre = () => {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative -mx-4 md:-mx-8 -mt-6 md:-mt-10 mb-12 md:mb-20">
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden rounded-b-3xl">
          <img
            src={heroImage}
            alt="Sobre a Escola Aviva"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="container-custom"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-sm font-semibold text-background/90 uppercase tracking-wider">
                  Nossa História
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-background max-w-2xl">
                Sobre a Escola Aviva
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
            Nossa Missão
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A Escola Aviva nasceu do desejo de formar discípulos de Cristo 
            equipados com conhecimento bíblico sólido e uma vida espiritual 
            profunda. Acreditamos que a formação espiritual é fundamental 
            para uma vida cristã plena e impactante.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            Nossos Valores
          </h2>
          <p className="text-muted-foreground">
            Os pilares que guiam nossa missão educacional.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="card-hover h-full text-center">
                <CardContent className="p-6">
                  <div className="icon-container mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            Nossa Equipe
          </h2>
          <p className="text-muted-foreground">
            Líderes comprometidos com sua formação espiritual.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="card-hover text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-medium overflow-hidden">
            <div className="gradient-hero">
              <CardContent className="p-6 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">
                  Faça Parte da Nossa Comunidade
                </h2>
                <p className="text-primary-foreground/80 max-w-xl mx-auto">
                  Junte-se a nós nessa jornada de crescimento espiritual e 
                  conhecimento bíblico. Sua transformação começa aqui.
                </p>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default Sobre;
