import { Check, Lock, Play, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonWithProgress } from "@/types/course";

// Re-export for backward compatibility
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  videoId: string;
}

interface LessonListProps {
  lessons: LessonWithProgress[];
  currentLessonId: string;
  onSelectLesson: (lesson: LessonWithProgress) => void;
}

export function LessonList({ lessons, currentLessonId, onSelectLesson }: LessonListProps) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson, index) => {
        const isCurrent = lesson.id === currentLessonId;
        const isCompleted = lesson.is_completed;
        const isLocked = lesson.is_locked;
        const hasQuiz = lesson.has_quiz;

        return (
          <button
            key={lesson.id}
            onClick={() => !isLocked && onSelectLesson(lesson)}
            disabled={isLocked}
            aria-label={`${isLocked ? 'Bloqueada: ' : ''}${isCompleted ? 'Concluída: ' : ''}Aula ${index + 1}: ${lesson.titulo}`}
            aria-current={isCurrent ? "true" : undefined}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
              isCurrent
                ? "bg-primary text-primary-foreground"
                : isLocked
                  ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                  : "bg-card hover:bg-secondary border border-border"
            )}
          >
            {/* Status Icon */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold",
              isCurrent
                ? "bg-primary-foreground/20 text-primary-foreground"
                : isCompleted
                  ? "bg-green-500/20 text-green-600"
                  : isLocked
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary"
            )}>
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : isLocked ? (
                <Lock className="w-4 h-4" />
              ) : isCurrent ? (
                <Play className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>

            {/* Lesson Info */}
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-medium text-sm truncate",
                isCurrent ? "text-primary-foreground" : "text-foreground"
              )}>
                {lesson.titulo}
              </h4>
              <div className={cn(
                "flex items-center gap-2 text-xs mt-0.5",
                isCurrent ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{lesson.duracao}</span>
                </div>
                {hasQuiz && (
                  <div className={cn(
                    "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs",
                    isCurrent
                      ? "bg-primary-foreground/20"
                      : "bg-amber-100 text-amber-700"
                  )}>
                    <BookOpen className="w-3 h-3" />
                    <span>Quiz</span>
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
