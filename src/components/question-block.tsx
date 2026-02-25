"use client";

import type { QuizQuestion } from "@/lib/types";

interface QuestionBlockProps {
  index: number;
  question: QuizQuestion;
  selectedIndex: number;
  disabled: boolean;
  submitted: boolean;
  textClassName?: string;
  highContrast?: boolean;
  onChange: (index: number, optionIndex: number) => void;
}

export function QuestionBlock(props: QuestionBlockProps): JSX.Element {
  const { index, question, selectedIndex, disabled, submitted, textClassName = "", highContrast = false, onChange } = props;

  return (
    <article className={`rounded-2xl border p-5 shadow-soft ${highContrast ? "border-calm-800 bg-white" : "border-calm-200 bg-white"}`}>
      <p className="text-sm font-semibold text-calm-500">Вопрос {index + 1}</p>
      <h3 className={`mt-2 font-semibold text-calm-900 ${textClassName}`}>{question.question}</h3>

      <div className="mt-4 space-y-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedIndex === optionIndex;
          const isCorrect = option === question.correct_answer;
          const isWrongSelected = submitted && isSelected && !isCorrect;

          let stateClass = "border-calm-200 bg-calm-50 hover:bg-calm-100";
          if (submitted && isCorrect) {
            stateClass = "border-emerald-300 bg-emerald-50";
          } else if (isWrongSelected) {
            stateClass = "border-rose-300 bg-rose-50";
          } else if (isSelected) {
            stateClass = "border-calm-400 bg-white";
          }

          return (
            <label
              key={`${question.question}-${option}`}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm ${stateClass} ${disabled ? "cursor-default" : ""}`}
            >
              <input
                type="radio"
                name={`q-${index}`}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onChange(index, optionIndex)}
                className="mt-0.5 h-4 w-4 accent-calm-700"
              />
              <span className={`text-calm-800 ${textClassName}`}>{option}</span>
            </label>
          );
        })}
      </div>

      {submitted ? (
        <div className="mt-4 rounded-xl border border-calm-200 bg-calm-50 p-4">
          <p className="text-sm font-semibold text-calm-800">
            Правильный ответ: <span className="text-calm-900">{question.correct_answer}</span>
          </p>
          <p className={`mt-2 text-sm text-calm-700 ${textClassName}`}>{question.fact}</p>
        </div>
      ) : null}
    </article>
  );
}
