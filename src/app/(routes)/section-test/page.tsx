"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { QuestionBlock } from "@/components/question-block";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { cardThemeClass, readingTextClass } from "@/lib/accessibility";
import { loadSession, updateSession } from "@/lib/storage";
import type { SessionState } from "@/lib/types";

function SectionTestPageContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<SessionState | null>(null);
  const [sectionIndex, setSectionIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = loadSession();
    if (!saved.content) {
      router.replace("/import");
      return;
    }

    const param = searchParams.get("i");
    const parsed = param ? Number.parseInt(param, 10) : NaN;
    if (!Number.isInteger(parsed) || parsed < 0 || parsed >= saved.content.sections.length) {
      router.replace("/reader");
      return;
    }

    setSession(saved);
    setSectionIndex(parsed);
  }, [router, searchParams]);

  const section = useMemo(() => {
    if (!session?.content || sectionIndex === null) {
      return null;
    }
    return session.content.sections[sectionIndex];
  }, [session, sectionIndex]);

  if (!session || !session.content || sectionIndex === null || !section) {
    return (
      <div className="rounded-2xl border border-calm-200 bg-white p-6 text-sm text-calm-700">
        Загружаем мини-тест...
      </div>
    );
  }

  const content = session.content;
  const existingState = session.sectionTests[String(sectionIndex)];
  const answers =
    existingState?.answers && existingState.answers.length === section.mini_test.length
      ? existingState.answers
      : Array.from({ length: section.mini_test.length }, () => -1);
  const submitted = existingState?.submitted ?? false;

  const patchSession = (updater: (current: SessionState) => SessionState) => {
    const next = updateSession(updater);
    setSession(next);
  };
  const textClassName = readingTextClass(session);

  const handleAnswerChange = (questionIdx: number, optionIdx: number) => {
    patchSession((current) => {
      const currentSectionState = current.sectionTests[String(sectionIndex)];
      const nextAnswers =
        currentSectionState?.answers && currentSectionState.answers.length === section.mini_test.length
          ? [...currentSectionState.answers]
          : Array.from({ length: section.mini_test.length }, () => -1);
      nextAnswers[questionIdx] = optionIdx;

      return {
        ...current,
        sectionTests: {
          ...current.sectionTests,
          [String(sectionIndex)]: {
            answers: nextAnswers,
            submitted: currentSectionState?.submitted ?? false,
            score: currentSectionState?.score ?? 0
          }
        }
      };
    });
  };

  const handleSubmit = () => {
    patchSession((current) => {
      const state = current.sectionTests[String(sectionIndex)];
      const nextAnswers =
        state?.answers && state.answers.length === section.mini_test.length
          ? state.answers
          : Array.from({ length: section.mini_test.length }, () => -1);

      const score = section.mini_test.reduce((sum, q, idx) => {
        const selectedIndex = nextAnswers[idx];
        const selected = selectedIndex >= 0 ? q.options[selectedIndex] : null;
        return sum + (selected === q.correct_answer ? 1 : 0);
      }, 0);

      const completedSections = current.completedSections.includes(sectionIndex)
        ? current.completedSections
        : [...current.completedSections, sectionIndex].sort((a, b) => a - b);

      return {
        ...current,
        currentSectionIndex:
          current.content && sectionIndex < current.content.sections.length - 1 ? sectionIndex + 1 : sectionIndex,
        completedSections,
        sectionTests: {
          ...current.sectionTests,
          [String(sectionIndex)]: {
            answers: nextAnswers,
            submitted: true,
            score
          }
        }
      };
    });
  };

  const allAnswered = answers.every((value) => value >= 0);
  const score = existingState?.score ?? 0;
  const isLastSection = sectionIndex === content.sections.length - 1;

  const handleContinue = () => {
    if (isLastSection) {
      router.push("/final-test");
      return;
    }
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
    <div className="mx-auto max-w-4xl space-y-6">
      <section className={`rounded-3xl border p-6 shadow-soft sm:p-8 ${cardThemeClass(session)}`}>
        <p className="text-sm font-semibold uppercase tracking-wide text-calm-500">Мини-тест секции</p>
        <h1 className="mt-2 text-2xl font-bold text-calm-900">{section.title}</h1>
        <p className="mt-2 text-sm text-calm-700">3 вопроса по текущей секции. После проверки увидите объяснения (fact).</p>
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
        {section.mini_test.map((question, idx) => (
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
            Проверить
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-calm-900">
              Результат: {score}/{section.mini_test.length}
            </p>
            <button
              type="button"
              onClick={handleContinue}
              className="rounded-2xl bg-calm-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-calm-800"
            >
              {isLastSection ? "К финальному тесту" : "Продолжить чтение"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function SectionTestPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-calm-200 bg-white p-6 text-sm text-calm-700">
          Загружаем мини-тест...
        </div>
      }
    >
      <SectionTestPageContent />
    </Suspense>
  );
}
