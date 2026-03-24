import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuestionWithOptions } from '@/types/course';

interface QuizQuestionProps {
  question: QuestionWithOptions;
  questionNumber: number;
  selectedAnswer: string | undefined;
  onAnswerSelect: (optionId: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

export function QuizQuestion({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
  showResult = false,
  isCorrect,
}: QuizQuestionProps) {
  const correctOptionId = question.options.find((o) => o.is_correta)?.id;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-aviva-blue/10 text-aviva-blue flex items-center justify-center font-semibold text-xs sm:text-sm">
          {questionNumber}
        </span>
        <h3 className="text-sm sm:text-base font-medium text-foreground pt-0.5 sm:pt-1 leading-snug">
          {question.texto_pergunta}
        </h3>
      </div>

      <RadioGroup
        value={selectedAnswer}
        onValueChange={onAnswerSelect}
        disabled={showResult}
        className="ml-0 sm:ml-10 space-y-2"
      >
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrectOption = option.id === correctOptionId;

          let optionStyle = '';
          let icon = null;

          if (showResult) {
            if (isCorrectOption) {
              optionStyle = 'border-green-500/50 bg-green-500/10';
              icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
            } else if (isSelected && !isCorrectOption) {
              optionStyle = 'border-destructive/50 bg-destructive/10';
              icon = <XCircle className="w-5 h-5 text-destructive" />;
            }
          } else if (isSelected) {
            optionStyle = 'border-aviva-blue bg-aviva-blue/5';
          }

          return (
            <div
              key={option.id}
              className={cn(
                'flex items-center space-x-2 sm:space-x-3 rounded-lg border p-3 sm:p-4 transition-all cursor-pointer hover:border-aviva-blue/50',
                optionStyle || 'border-border'
              )}
              onClick={() => !showResult && onAnswerSelect(option.id)}
            >
              <RadioGroupItem
                value={option.id}
                id={option.id}
                className="text-aviva-blue flex-shrink-0"
              />
              <Label
                htmlFor={option.id}
                className={cn(
                  'flex-1 cursor-pointer text-xs sm:text-sm leading-snug',
                  showResult && isCorrectOption && 'font-medium text-green-600 dark:text-green-400',
                  showResult && isSelected && !isCorrectOption && 'text-destructive'
                )}
              >
                {option.texto_opcao}
              </Label>
              {showResult && icon && (
                <span className="flex-shrink-0">{icon}</span>
              )}
            </div>
          );
        })}
      </RadioGroup>

      {showResult && question.explicacao && (
        <div className="ml-0 sm:ml-10 mt-3 sm:mt-4 p-3 sm:p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-primary">Explicacao</p>
              <p className="text-xs sm:text-sm text-primary/80 mt-1 leading-relaxed">{question.explicacao}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
