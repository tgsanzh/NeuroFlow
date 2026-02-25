"use client";

import type { ReaderMode } from "@/lib/types";

interface ModeSwitcherProps {
  mode: ReaderMode;
  largeText: boolean;
  onModeChange: (mode: ReaderMode) => void;
  onLargeTextToggle: (value: boolean) => void;
}

export function ModeSwitcher(props: ModeSwitcherProps): JSX.Element {
  const { mode, largeText, onModeChange, onLargeTextToggle } = props;

  return (
    <div className="rounded-2xl border border-calm-200 bg-white p-4 shadow-soft">
      <div className="mb-3">
        <p className="text-sm font-semibold text-calm-900">Focus Mode</p>
        <p className="text-sm text-calm-600">ADHD: пошаговое чтение. Dyslexia: крупнее текст и тёплый фон.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onModeChange("adhd")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            mode === "adhd" ? "bg-calm-700 text-white" : "bg-calm-100 text-calm-800 hover:bg-calm-200"
          }`}
        >
          ADHD Mode
        </button>
        <button
          type="button"
          onClick={() => onModeChange("dyslexia")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            mode === "dyslexia" ? "bg-calm-700 text-white" : "bg-calm-100 text-calm-800 hover:bg-calm-200"
          }`}
        >
          Dyslexia Mode
        </button>
      </div>

      {mode === "dyslexia" ? (
        <label className="mt-4 flex items-center justify-between rounded-xl bg-warm-50 px-4 py-3 text-sm text-calm-800">
          <span>Крупный текст</span>
          <input
            type="checkbox"
            checked={largeText}
            onChange={(e) => onLargeTextToggle(e.target.checked)}
            className="h-4 w-4 accent-calm-700"
          />
        </label>
      ) : null}
    </div>
  );
}
