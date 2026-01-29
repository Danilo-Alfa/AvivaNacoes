import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMarkLessonComplete } from '@/hooks/useProgress';
import { CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface LessonCompleteButtonProps {
  lessonId: string;
  courseId: string;
  hasQuiz: boolean;
  isCompleted: boolean;
  onQuizRequired: () => void;
  onComplete: () => void;
}

export function LessonCompleteButton({
  lessonId,
  courseId,
  hasQuiz,
  isCompleted,
  onQuizRequired,
  onComplete,
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

  return (
    <Button
      onClick={handleClick}
      disabled={isMarking}
      className="gap-2 bg-aviva-blue hover:bg-aviva-blue/90"
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
