"use client";

import { useEffect, useMemo, useState } from "react";

import { clearResults, loadResults } from "@/lib/storage";
import type { ResultAttempt } from "@/lib/types";

export default function ResultsPage(): JSX.Element {
  const [results, setResults] = useState<ResultAttempt[]>([]);

  useEffect(() => {
    setResults(loadResults());
  }, []);

  const formatted = useMemo(
    () =>
      results.map((result) => ({
        ...result,
        dateLabel: new Date(result.timestamp).toLocaleString("ru-RU")
      })),
    [results]
  );

  const handleClear = () => {
    if (!window.confirm("Очистить историю результатов?")) {
      return;
    }
    clearResults();
    setResults([]);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-3xl border border-calm-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-calm-500">Results</p>
            <h1 className="mt-2 text-2xl font-bold text-calm-900">История попыток</h1>
            <p className="mt-2 text-sm text-calm-700">Дата/время, режим и score сохраняются в localStorage.</p>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Очистить историю
          </button>
        </div>
      </section>

      {formatted.length === 0 ? (
        <div className="rounded-2xl border border-calm-200 bg-calm-50 p-6 text-sm text-calm-700">
          История пуста. Пройдите финальный тест и сохраните результат.
        </div>
      ) : (
        <div className="space-y-3">
          {formatted.map((result) => (
            <article key={result.id} className="rounded-2xl border border-calm-200 bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-calm-900">{result.title}</p>
                  <p className="mt-1 text-sm text-calm-600">{result.dateLabel}</p>
                </div>
                <div className="rounded-xl bg-calm-50 px-4 py-2 text-sm font-semibold text-calm-800">
                  {result.mode === "adhd" ? "ADHD" : "Dyslexia"} • {result.score}/{result.total}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
