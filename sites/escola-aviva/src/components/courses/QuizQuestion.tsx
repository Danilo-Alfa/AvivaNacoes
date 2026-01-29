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
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-aviva-blue/10 text-aviva-blue flex items-center justify-center font-semibold text-sm">
          {questionNumber}
        </span>
        <h3 className="text-base font-medium text-gray-900 pt-1">
          {question.texto_pergunta}
        </h3>
      </div>

      <RadioGroup
        value={selectedAnswer}
        onValueChange={onAnswerSelect}
        disabled={showResult}
        className="ml-11 space-y-2"
      >
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrectOption = option.id === correctOptionId;

          let optionStyle = '';
          let icon = null;

          if (showResult) {
            if (isCorrectOption) {
              optionStyle = 'border-green-500 bg-green-50';
              icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
            } else if (isSelected && !isCorrectOption) {
              optionStyle = 'border-red-500 bg-red-50';
              icon = <XCircle className="w-5 h-5 text-red-600" />;
            }
          } else if (isSelected) {
            optionStyle = 'border-aviva-blue bg-aviva-blue/5';
          }

          return (
            <div
              key={option.id}
              className={cn(
                'flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer hover:border-aviva-blue/50',
                optionStyle || 'border-gray-200'
              )}
              onClick={() => !showResult && onAnswerSelect(option.id)}
            >
              <RadioGroupItem
                value={option.id}
                id={option.id}
                className="text-aviva-blue"
              />
              <Label
                htmlFor={option.id}
                className={cn(
                  'flex-1 cursor-pointer text-sm',
                  showResult && isCorrectOption && 'font-medium text-green-700',
                  showResult && isSelected && !isCorrectOption && 'text-red-700'
                )}
              >
                {option.texto_opcao}
              </Label>
              {showResult && icon}
            </div>
          );
        })}
      </RadioGroup>

      {showResult && question.explicacao && (
        <div className="ml-11 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Explicacao</p>
              <p className="text-sm text-blue-700 mt-1">{question.explicacao}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
