import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMarkLessonComplete } from '@/hooks/useProgress';
import { CheckCircle2, Loader2, BookOpen, Play } from 'lucide-react';
import { toast } from 'sonner';

interface LessonCompleteButtonProps {
  lessonId: string;
  courseId: string;
  hasQuiz: boolean;
  isCompleted: boolean;
  onQuizRequired: () => void;
  onComplete: () => void;
  videoWatched?: boolean; // Se o vídeo foi assistido (80%+)
}

export function LessonCompleteButton({
  lessonId,
  courseId,
  hasQuiz,
  isCompleted,
  onQuizRequired,
  onComplete,
  videoWatched = false,
}: LessonCompleteButtonProps) {
  const markComplete = useMarkLessonComplete();
  const [isMarking, setIsMarking] = useState(false);

  const handleClick = async () => {
    if (isCompleted) return;

    if (hasQuiz) {
      onQuizRequired();
      return;
    }

    setIsMarking(true);
    try {
      await markComplete.mutateAsync({ lessonId, courseId });
      toast.success('Aula concluida!');
      onComplete();
    } catch (error) {
      console.error('Erro ao marcar aula:', error);
      toast.error('Erro ao marcar aula como concluida');
    } finally {
      setIsMarking(false);
    }
  };

  if (isCompleted) {
    return (
      <Button
        variant="outline"
        disabled
        className="gap-2 text-green-600 border-green-200 bg-green-50"
      >
        <CheckCircle2 className="w-4 h-4" />
        Aula Concluida
      </Button>
    );
  }

  // TODO: Descomentar após os testes
  // Se o vídeo não foi assistido, mostrar botão desabilitado
  // if (!videoWatched) {
  //   return (
  //     <div className="space-y-2">
  //       <Button
  //         disabled
  //         className="gap-2 bg-gray-400 text-white cursor-not-allowed"
  //       >
  //         <Play className="w-4 h-4" />
  //         Assista o vídeo para liberar
  //       </Button>
  //       <p className="text-xs text-muted-foreground">
  //         Você precisa assistir pelo menos 80% do vídeo para concluir a aula
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <Button
      onClick={handleClick}
      disabled={isMarking}
      className="gap-2 bg-aviva-blue hover:bg-aviva-blue/90 text-white w-full sm:w-auto min-h-[44px] text-sm font-medium shadow-md"
    >
      {isMarking ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Marcando...
        </>
      ) : hasQuiz ? (
        <>
          <BookOpen className="w-4 h-4" />
          Fazer Quiz para Concluir
        </>
      ) : (
        <>
          <CheckCircle2 className="w-4 h-4" />
          Concluir Aula
        </>
      )}
    </Button>
  );
}
