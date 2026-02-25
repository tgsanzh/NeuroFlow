import Link from "next/link";

export default function HomePage(): JSX.Element {
  return (
    <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-3xl border border-calm-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-calm-600">NeuroFlow Demo</p>
        <h1 className="mt-3 text-3xl font-bold text-calm-900 sm:text-4xl">
          Скан страницы -> Focus Reader -> Мини-тесты -> Финальный тест
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-calm-700">
          Демонстрационное приложение без логина. Контент и тесты загружаются из локального demo JSON.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/import"
            className="rounded-2xl bg-calm-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-calm-800"
          >
            Начать
          </Link>
          <Link
            href="/results"
            className="rounded-2xl border border-calm-200 bg-calm-50 px-6 py-3 text-base font-semibold text-calm-800 transition hover:bg-calm-100"
          >
            История результатов
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <article className="rounded-2xl border border-calm-200 bg-calm-50 p-6">
          <h2 className="text-lg font-semibold text-calm-900">ADHD Mode</h2>
          <p className="mt-2 text-sm leading-6 text-calm-700">
            Пошаговое чтение с минимумом отвлекающих элементов, короткими блоками текста и явными действиями.
          </p>
        </article>

        <article className="rounded-2xl border border-warm-200 bg-warm-50 p-6">
          <h2 className="text-lg font-semibold text-calm-900">Dyslexia Mode</h2>
          <p className="mt-2 text-sm leading-6 text-calm-700">
            Тёплый фон, увеличенный межстрочный интервал и переключатель крупного текста для более комфортного чтения.
          </p>
        </article>

        <article className="rounded-2xl border border-calm-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-calm-900">Что внутри</h2>
          <ul className="mt-3 space-y-2 text-sm text-calm-700">
            <li>Focus Reader по секциям</li>
            <li>Мини-тест после каждой секции</li>
            <li>Финальный тест на 10 вопросов</li>
            <li>История попыток в localStorage</li>
            <li>Настройки доступности чтения и контраста</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
