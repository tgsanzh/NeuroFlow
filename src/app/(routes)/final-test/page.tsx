"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { QuestionBlock } from "@/components/question-block";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { cardThemeClass, readingTextClass } from "@/lib/accessibility";
import { loadSession, saveResultAttempt, updateSession } from "@/lib/storage";
import type { QuizQuestion, SessionState } from "@/lib/types";

interface MistakeRow {
  question: QuizQuestion;
  selected: string | null;
}

export default function FinalTestPage(): JSX.Element {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const next = loadSession();
    if (!next.content) {
      router.replace("/import");
      return;
    }
    setSession(next);
  }, [router]);

  const finalQuestions = session?.content?.final_test ?? [];
  const finalState = session?.finalTest;
  const answers =
    finalState?.answers && finalState.answers.length === finalQuestions.length
      ? finalState.answers
      : Array.from({ length: finalQuestions.length }, () => -1);
  const submitted = finalState?.submitted ?? false;

  const patchSession = (updater: (current: SessionState) => SessionState) => {
    const next = updateSession(updater);
    setSession(next);
  };

  const handleAnswerChange = (questionIdx: number, optionIdx: number) => {
    patchSession((current) => {
      if (!current.content) {
        return current;
      }
      const baseAnswers =
        current.finalTest?.answers && current.finalTest.answers.length === current.content.final_test.length
          ? [...current.finalTest.answers]
          : Array.from({ length: current.content.final_test.length }, () => -1);
      baseAnswers[questionIdx] = optionIdx;

      return {
        ...current,
        finalTest: {
          answers: baseAnswers,
          submitted: current.finalTest?.submitted ?? false,
          score: current.finalTest?.score ?? 0
        }
      };
    });
    setSaved(false);
  };

  const handleSubmit = () => {
    patchSession((current) => {
      if (!current.content) {
        return current;
      }
      const nextAnswers =
        current.finalTest?.answers && current.finalTest.answers.length === current.content.final_test.length
          ? current.finalTest.answers
          : Array.from({ length: current.content.final_test.length }, () => -1);

      const score = current.content.final_test.reduce((sum, q, idx) => {
        const selectedIndex = nextAnswers[idx];
        const selected = selectedIndex >= 0 ? q.options[selectedIndex] : null;
        return sum + (selected === q.correct_answer ? 1 : 0);
      }, 0);

      return {
        ...current,
        finalTest: {
          answers: nextAnswers,
          submitted: true,
          score
        }
      };
    });
    setSaved(false);
  };

  const mistakes = useMemo<MistakeRow[]>(() => {
    if (!session?.content || !submitted) {
      return [];
    }
    return session.content.final_test
      .map((question, idx) => {
        const selectedIndex = answers[idx];
        const selected = selectedIndex >= 0 ? question.options[selectedIndex] : null;
        if (selected === question.correct_answer) {
          return null;
        }
        return { question, selected };
      })
      .filter((row): row is MistakeRow => row !== null);
  }, [answers, session, submitted]);

  if (!session || !session.content) {
    return (
      <div className="rounded-2xl border border-calm-200 bg-white p-6 text-sm text-calm-700">
        Загружаем финальный тест...
      </div>
    );
  }

  const content = session.content;
  const score = session.finalTest?.score ?? 0;
  const total = content.final_test.length;
  const allAnswered = answers.every((value) => value >= 0);
  const textClassName = readingTextClass(session);

  const handleSaveResult = () => {
    if (!submitted) {
      return;
    }
    saveResultAttempt({
      id: `${Date.now()}`,
      timestamp: new Date().toISOString(),
      mode: session.mode,
      score,
      total,
      title: content.overall_title
    });
    setSaved(true);
  };

  const handleRestart = () => {
    updateSession((current) => ({
      ...current,
      currentSectionIndex: 0,
      completedSections: [],
      sectionTests: {},
      finalTest: null
    }));
    router.push("/reader");
  };

  const handleFontSizeChange = (value: SessionState["readingFontSize"]) => {
    patchSession((current) => ({ ...current, readingFontSize: value }));
  };

  const handleLetterSpacingChange = (value: SessionState["readingLetterSpacing"]) => {
    patchSession((current) => ({ ...current, readingLetterSpacing: value }));
  };

  const handleHighContrastChange = (value: boolean) => {
    patchSession((current) => ({ ...current, highContrast: value }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className={`rounded-3xl border p-6 shadow-soft sm:p-8 ${cardThemeClass(session)}`}>
        <p className="text-sm font-semibold uppercase tracking-wide text-calm-500">Final Test</p>
        <h1 className="mt-2 text-2xl font-bold text-calm-900">Финальный тест (10 вопросов)</h1>
        <p className="mt-2 text-sm text-calm-700">
          После завершения вы увидите score и список ошибок с правильными ответами и пояснениями.
        </p>
      </section>

      <AccessibilityPanel
        fontSize={session.readingFontSize}
        letterSpacing={session.readingLetterSpacing}
        highContrast={session.highContrast}
        onFontSizeChange={handleFontSizeChange}
        onLetterSpacingChange={handleLetterSpacingChange}
        onHighContrastChange={handleHighContrastChange}
      />

      <div className="space-y-4">
        {finalQuestions.map((question, idx) => (
          <QuestionBlock
            key={`${question.question}-${idx}`}
            index={idx}
            question={question}
            selectedIndex={answers[idx] ?? -1}
            disabled={submitted}
            submitted={submitted}
            textClassName={textClassName}
            highContrast={session.highContrast}
            onChange={handleAnswerChange}
          />
        ))}
      </div>

      <section className={`rounded-2xl border p-5 shadow-soft ${session.highContrast ? "border-calm-800 bg-white" : "border-calm-200 bg-white"}`}>
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="rounded-2xl bg-calm-700 px-5 py-3 text-sm font-semibold text-white transition enabled:hover:bg-calm-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Завершить
          </button>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-calm-200 bg-calm-50 p-4">
              <p className="text-lg font-bold text-calm-900">
                Score: {score}/{total}
              </p>
              <p className="mt-1 text-sm text-calm-700">Режим: {session.mode === "adhd" ? "ADHD" : "Dyslexia"}</p>
            </div>

            {mistakes.length > 0 ? (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-calm-600">Ошибки</h2>
                {mistakes.map((item, idx) => (
                  <div key={`${item.question.question}-${idx}`} className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                    <p className={`text-sm font-semibold text-calm-900 ${textClassName}`}>{item.question.question}</p>
                    <p className="mt-2 text-sm text-rose-700">
                      Ваш ответ: {item.selected ?? "Не выбран"} | Правильный: {item.question.correct_answer}
                    </p>
                    <p className={`mt-2 text-sm text-calm-700 ${textClassName}`}>{item.question.fact}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                Ошибок нет. Отличный результат.
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSaveResult}
                className="rounded-2xl bg-calm-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-calm-800"
              >
                Сохранить результат
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-2xl border border-calm-200 bg-calm-50 px-5 py-3 text-sm font-semibold text-calm-800 transition hover:bg-calm-100"
              >
                Начать заново
              </button>
              <Link
                href="/results"
                className="rounded-2xl border border-calm-200 bg-white px-5 py-3 text-sm font-semibold text-calm-800 transition hover:bg-calm-50"
              >
                Открыть историю
              </Link>
            </div>

            {saved ? <p className="text-sm font-medium text-emerald-700">Результат сохранён в localStorage.</p> : null}
          </div>
        )}
      </section>
    </div>
  );
}
