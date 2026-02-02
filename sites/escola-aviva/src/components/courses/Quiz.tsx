import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuizQuestion } from './QuizQuestion';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import type { QuestionWithOptions, QuizResult } from '@/types/course';

interface QuizProps {
  questions: QuestionWithOptions[];
  onSubmit: (answers: Record<string, string>) => Promise<QuizResult>;
  onComplete: (passed: boolean) => void;
  onRetry: () => void;
  isSubmitting?: boolean;
}

export function Quiz({
  questions,
  onSubmit,
  onComplete,
  onRetry,
  isSubmitting = false,
}: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const progress = (answeredCount / questions.length) * 100;

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;

    try {
      const quizResult = await onSubmit(answers);
      setResult(quizResult);
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao enviar quiz:', error);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setShowResults(false);
    onRetry();
  };

  const handleContinue = () => {
    if (result) {
      onComplete(result.passed);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com progresso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progresso do Quiz</span>
          <span>
            {answeredCount} de {questions.length} respondidas
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Resultado do Quiz */}
      {showResults && result && (
        <div
          className={`p-6 rounded-lg border-2 ${
            result.passed
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center gap-4">
            {result.passed ? (
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
            <div>
              <h3
                className={`text-xl font-bold ${
                  result.passed ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.passed ? 'Parabens!' : 'Quase la!'}
              </h3>
              <p
                className={`text-sm ${
                  result.passed ? 'text-green-700' : 'text-red-700'
                }`}
              >
                Voce acertou {result.correct_answers} de {result.total_questions}{' '}
                perguntas ({result.percentage}%)
              </p>
              {!result.passed && (
                <p className="text-sm text-red-600 mt-1">
                  Voce precisa de pelo menos 70% para avancar. Tente novamente!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Perguntas */}
      <div className="space-y-8">
        {questions.map((question, index) => {
          const response = result?.responses.find(
            (r) => r.question_id === question.id
          );

          return (
            <QuizQuestion
              key={question.id}
              question={question}
              questionNumber={index + 1}
              selectedAnswer={answers[question.id]}
              onAnswerSelect={(optionId) =>
                handleAnswerSelect(question.id, optionId)
              }
              showResult={showResults}
              isCorrect={response?.is_correct}
            />
          );
        })}
      </div>

      {/* Botoes de acao */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {!showResults ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? 'Verificando...' : 'Verificar Respostas'}
          </Button>
        ) : (
          <>
            {!result?.passed && (
              <Button
                variant="outline"
                onClick={handleRetry}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Tentar Novamente
              </Button>
            )}
            <Button
              onClick={handleContinue}
              disabled={!result?.passed}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              {result?.passed ? 'Continuar' : 'Precisa passar para continuar'}
              {result?.passed && <ArrowRight className="w-4 h-4" />}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
