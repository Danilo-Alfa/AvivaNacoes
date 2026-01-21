import { motion } from "framer-motion";
import { FileText, Download, Clock, BookOpen, Search } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Material {
  id: string;
  title: string;
  description: string;
  type: "PDF" | "Apostila" | "Estudo";
  course: string;
  size: string;
  available: boolean;
}

const materials: Material[] = [
  {
    id: "1",
    title: "Apostila - Fundamentos da Fé",
    description: "Material completo de apoio para o curso Fundamentos da Fé.",
    type: "Apostila",
    course: "Fundamentos da Fé",
    size: "2.4 MB",
    available: false,
  },
  {
    id: "2",
    title: "Guia de Oração Diária",
    description: "Um guia prático para desenvolver sua rotina de oração.",
    type: "PDF",
    course: "Vida de Oração",
    size: "850 KB",
    available: false,
  },
  {
    id: "3",
    title: "Panorama Bíblico - Mapas e Cronologia",
    description: "Mapas ilustrativos e cronologia dos eventos bíblicos.",
    type: "Estudo",
    course: "Panorama Bíblico",
    size: "5.2 MB",
    available: false,
  },
];

const Materiais = () => {
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
            Materiais de Estudo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acesse apostilas, PDFs e materiais complementares para aprofundar 
            seus estudos e fortalecer seu aprendizado.
          </p>
        </motion.div>
      </section>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar materiais..."
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Materials Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {materials.map((material, index) => (
          <motion.div
            key={material.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="card-hover h-full">
              <CardContent className="p-4 md:p-6 flex flex-col h-full">
                {/* Icon */}
                <div className="icon-container mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>

                {/* Badge */}
                <span className="badge-primary inline-block w-fit mb-3">
                  {material.type}
                </span>

                {/* Title & Description */}
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {material.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  {material.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{material.course}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{material.size}</span>
                  </div>
                </div>

                {/* Download Button */}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled={!material.available}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {material.available ? "Baixar" : "Em Breve"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
        <Card className="shadow-soft bg-secondary/50">
          <CardContent className="p-6 md:p-10 text-center">
            <div className="icon-container mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">
              Mais Materiais em Breve
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Estamos preparando novos materiais de estudo para complementar 
              sua jornada de aprendizado espiritual.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default Materiais;
