"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AccessibilityPanel } from "@/components/accessibility-panel";
import { ModeSwitcher } from "@/components/mode-switcher";
import { cardThemeClass, readingTextClass } from "@/lib/accessibility";
import { loadSession, updateSession } from "@/lib/storage";
import { chunkTextIntoParagraphs } from "@/lib/text";
import type { SessionState } from "@/lib/types";

export default function ReaderPage(): JSX.Element {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    const saved = loadSession();
    if (!saved.content) {
      router.replace("/import");
      return;
    }
    setSession(saved);
  }, [router]);

  const content = session?.content ?? null;
  const sectionIndex = session?.currentSectionIndex ?? 0;
  const currentSection = content?.sections[sectionIndex];

  const paragraphs = useMemo(
    () => (currentSection ? chunkTextIntoParagraphs(currentSection.content, 2) : []),
    [currentSection]
  );

  if (!session || !content || !currentSection) {
    return (
      <div className="rounded-2xl border border-calm-200 bg-white p-6 text-sm text-calm-700">
        Загружаем данные сессии...
      </div>
    );
  }

  const isLastSection = sectionIndex === content.sections.length - 1;
  const isDyslexia = session.mode === "dyslexia";
  const sectionCompleted = session.completedSections.includes(sectionIndex);
  const bodyTextClass = readingTextClass(session);

  const patchSession = (updater: (current: SessionState) => SessionState) => {
    const next = updateSession(updater);
    setSession(next);
  };

  const goToSection = (index: number) => {
    patchSession((current) => {
      if (!current.content) {
        return current;
      }
      const safeIndex = Math.max(0, Math.min(index, current.content.sections.length - 1));
      return { ...current, currentSectionIndex: safeIndex };
    });
  };

  const handlePrev = () => goToSection(sectionIndex - 1);
  const handleNext = () => goToSection(sectionIndex + 1);

  const handleModeChange = (mode: SessionState["mode"]) => {
    patchSession((current) => ({ ...current, mode }));
  };

  const handleLargeTextToggle = (value: boolean) => {
    patchSession((current) => ({ ...current, dyslexiaLargeText: value }));
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
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-calm-200 bg-white p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-calm-500">Документ</p>
          <h1 className="mt-2 text-lg font-bold text-calm-900">{content.overall_title}</h1>
          <p className="mt-2 text-sm text-calm-600">
            Секция {sectionIndex + 1} из {content.sections.length}
          </p>
        </div>

        <ModeSwitcher
          mode={session.mode}
          largeText={session.dyslexiaLargeText}
          onModeChange={handleModeChange}
          onLargeTextToggle={handleLargeTextToggle}
        />

        <AccessibilityPanel
          fontSize={session.readingFontSize}
          letterSpacing={session.readingLetterSpacing}
          highContrast={session.highContrast}
          onFontSizeChange={handleFontSizeChange}
          onLetterSpacingChange={handleLetterSpacingChange}
          onHighContrastChange={handleHighContrastChange}
        />

        <div className="rounded-2xl border border-calm-200 bg-white p-4 shadow-soft">
          <p className="mb-3 text-sm font-semibold text-calm-900">Секции</p>
          <div className="space-y-2">
            {content.sections.map((section, idx) => {
              const active = idx === sectionIndex;
              const completed = session.completedSections.includes(idx);
              return (
                <button
                  key={`${section.title}-${idx}`}
                  type="button"
                  onClick={() => goToSection(idx)}
                  className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                    active
                      ? "border-calm-500 bg-calm-100"
                      : "border-calm-200 bg-calm-50 hover:bg-calm-100"
                  }`}
                >
                  <span className="block font-semibold text-calm-900">{section.title}</span>
                  <span className="mt-1 block text-xs text-calm-600">
                    {completed ? "Мини-тест пройден" : "Ожидает мини-тест"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <section className={`rounded-3xl border p-6 shadow-soft sm:p-8 ${cardThemeClass(session)}`}>
        <div className={session.mode === "adhd" ? "space-y-5" : "space-y-6"}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-calm-500">
              {session.mode === "adhd" ? "ADHD Focus Reader" : "Dyslexia Focus Reader"}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-calm-900">{currentSection.title}</h2>
          </div>

          <div className={`space-y-4 text-calm-800 ${bodyTextClass}`}>
            {paragraphs.map((paragraph, idx) => (
              <p
                key={`${idx}-${paragraph.slice(0, 16)}`}
                className={`rounded-2xl px-4 py-3 ${
                  session.highContrast
                    ? "border border-calm-700 bg-white"
                    : session.mode === "adhd"
                      ? "bg-calm-50"
                      : "bg-white/70"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {currentSection.key_points && currentSection.key_points.length > 0 ? (
            <div className="rounded-2xl border border-calm-200 bg-white/80 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-calm-600">Key Points</h3>
              <ul className="mt-3 space-y-2">
                {currentSection.key_points.map((point, idx) => (
                  <li
                    key={`${idx}-${point.slice(0, 12)}`}
                    className={`rounded-xl px-3 py-2 text-calm-800 ${session.highContrast ? "border border-calm-700 bg-white" : "bg-calm-50"} ${bodyTextClass}`}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 border-t border-calm-200 pt-4">
            <button
              type="button"
              onClick={handlePrev}
              disabled={sectionIndex === 0}
              className="rounded-2xl border border-calm-200 bg-calm-50 px-5 py-3 text-sm font-semibold text-calm-800 transition enabled:hover:bg-calm-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Назад
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isLastSection}
              className="rounded-2xl border border-calm-200 bg-calm-50 px-5 py-3 text-sm font-semibold text-calm-800 transition enabled:hover:bg-calm-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Далее
            </button>

            <Link
              href={`/section-test?i=${sectionIndex}`}
              className="ml-auto rounded-2xl bg-calm-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-calm-800"
            >
              Пройти мини-тест (3 вопроса)
            </Link>
          </div>

          {isLastSection && sectionCompleted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-800">Последняя секция пройдена. Можно перейти к финальному тесту.</p>
              <Link
                href="/final-test"
                className="mt-3 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Перейти к финальному тесту
              </Link>
            </div>
          ) : null}

          <div className="rounded-2xl border border-calm-200 bg-calm-50 p-4 text-sm text-calm-700">
            Подсказка по доступности: все элементы работают с клавиатуры, есть переход к содержимому (Tab), можно увеличить
            текст, расширить межбуквенный интервал и включить высокий контраст.
          </div>
        </div>
      </section>
    </div>
  );
}
