import { motion } from "framer-motion";
import { Play, Clock, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  lessonsCount: number;
  level: "Iniciante" | "Intermediário" | "Avançado";
  isNew?: boolean;
}

export function CourseCard({
  id,
  title,
  description,
  thumbnail,
  instructor,
  duration,
  lessonsCount,
  level,
  isNew = false,
}: CourseCardProps) {
  return (
    <Link to={`/cursos/${id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden card-hover bg-card border-border group">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                className="w-14 h-14 gradient-hero rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="w-6 h-6 text-primary-foreground ml-1" />
              </motion.div>
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {isNew && (
                <span className="badge-new">NOVO</span>
              )}
              <span className="badge-primary">{level}</span>
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="font-display font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{instructor}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{lessonsCount} aulas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
