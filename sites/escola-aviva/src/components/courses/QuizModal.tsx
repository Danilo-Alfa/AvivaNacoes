import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Quiz } from './Quiz';
import { useQuizQuestions, useSubmitQuiz } from '@/hooks/useQuiz';
import { Loader2, BookOpen } from 'lucide-react';
import type { QuizResult } from '@/types/course';

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string;
  lessonTitle: string;
  onQuizComplete: (passed: boolean) => void;
}

export function QuizModal({
  open,
  onOpenChange,
  lessonId,
  lessonTitle,
  onQuizComplete,
}: QuizModalProps) {
  const { data: questions, isLoading, error } = useQuizQuestions(lessonId);
  const submitQuiz = useSubmitQuiz();

  const handleSubmit = async (
    answers: Record<string, string>
  ): Promise<QuizResult> => {
    return submitQuiz.mutateAsync({ lessonId, answers });
  };

  const handleComplete = (passed: boolean) => {
    if (passed) {
      onQuizComplete(true);
      onOpenChange(false);
    }
  };

  const handleRetry = () => {
    // Reset state is handled internally by Quiz component
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] p-0 rounded-xl sm:rounded-lg flex flex-col overflow-hidden">
        {/* Header fixo */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-2 pr-10">
            <BookOpen className="w-5 h-5 text-aviva-blue flex-shrink-0" />
            <DialogTitle className="text-base sm:text-lg">Quiz: {lessonTitle}</DialogTitle>
          </div>
          <DialogDescription className="text-sm leading-relaxed">
            Responda as perguntas abaixo para testar seu conhecimento. Voce
            precisa acertar pelo menos 70% para avancar.
          </DialogDescription>
        </DialogHeader>

        {/* Conteudo rolavel */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-aviva-blue" />
              <p className="text-sm text-gray-500 mt-2">Carregando perguntas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Erro ao carregar perguntas.</p>
              <p className="text-sm text-gray-500">
                Tente fechar e abrir novamente.
              </p>
            </div>
          ) : questions && questions.length > 0 ? (
            <Quiz
              questions={questions}
              onSubmit={handleSubmit}
              onComplete={handleComplete}
              onRetry={handleRetry}
              isSubmitting={submitQuiz.isPending}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhuma pergunta encontrada para esta aula.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
