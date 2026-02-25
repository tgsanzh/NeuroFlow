"use client";

import type { ReadingFontSize, ReadingLetterSpacing } from "@/lib/types";

interface AccessibilityPanelProps {
  fontSize: ReadingFontSize;
  letterSpacing: ReadingLetterSpacing;
  highContrast: boolean;
  onFontSizeChange: (value: ReadingFontSize) => void;
  onLetterSpacingChange: (value: ReadingLetterSpacing) => void;
  onHighContrastChange: (value: boolean) => void;
}

export function AccessibilityPanel(props: AccessibilityPanelProps): JSX.Element {
  const { fontSize, letterSpacing, highContrast, onFontSizeChange, onLetterSpacingChange, onHighContrastChange } = props;

  const optionClass = (active: boolean) =>
    `rounded-xl px-3 py-2 text-sm font-semibold transition ${
      active ? "bg-calm-700 text-white" : "bg-calm-100 text-calm-800 hover:bg-calm-200"
    }`;

  return (
    <section
      aria-labelledby="accessibility-settings-title"
      className="rounded-2xl border border-calm-200 bg-white p-4 shadow-soft"
    >
      <h2 id="accessibility-settings-title" className="text-sm font-semibold text-calm-900">
        Настройки доступности
      </h2>
      <p className="mt-1 text-sm text-calm-600">
        Настройте размер текста, межбуквенный интервал и контраст для комфортного чтения.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-calm-500">Размер шрифта</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Размер шрифта">
            <button type="button" onClick={() => onFontSizeChange("base")} className={optionClass(fontSize === "base")}>
              Обычный
            </button>
            <button type="button" onClick={() => onFontSizeChange("large")} className={optionClass(fontSize === "large")}>
              Крупный
            </button>
            <button type="button" onClick={() => onFontSizeChange("xlarge")} className={optionClass(fontSize === "xlarge")}>
              Очень крупный
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-calm-500">Отступы символов</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Отступы символов">
            <button
              type="button"
              onClick={() => onLetterSpacingChange("normal")}
              className={optionClass(letterSpacing === "normal")}
            >
              Обычные
            </button>
            <button
              type="button"
              onClick={() => onLetterSpacingChange("wide")}
              className={optionClass(letterSpacing === "wide")}
            >
              Шире
            </button>
            <button
              type="button"
              onClick={() => onLetterSpacingChange("wider")}
              className={optionClass(letterSpacing === "wider")}
            >
              Максимум
            </button>
          </div>
        </div>

        <label className="flex items-center justify-between rounded-xl border border-calm-200 bg-calm-50 px-4 py-3 text-sm text-calm-800">
          <span>Высокий контраст</span>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => onHighContrastChange(e.target.checked)}
            className="h-4 w-4 accent-calm-700"
          />
        </label>
      </div>
    </section>
  );
}
