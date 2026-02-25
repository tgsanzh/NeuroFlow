"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import centralAsiaAdhd from "@/data/topic-central-asia-adhd.json";
import civilizationDyslexia from "@/data/topic-civilization-dyslexia.json";
import mlkAdhd from "@/data/topic-mlk-adhd.json";
import lifeBase from "@/data/temo.json";
import lifeAdhd from "@/data/topic-life-adhd.json";
import turkicEmpiresDyslexia from "@/data/topic-turkic-empires-dyslexia.json";
import { seedSessionWithContent } from "@/lib/storage";
import type { StudyContent } from "@/lib/types";

type TopicProfile = "ADHD" | "Dyslexia";

type DemoTopic = {
  id: string;
  title: string;
  modeHint: TopicProfile;
  content: StudyContent;
};

const demoTopics: DemoTopic[] = [
  {
    id: "life-base",
    title: (lifeBase as StudyContent).overall_title,
    modeHint: "ADHD",
    content: lifeBase as StudyContent
  },
  {
    id: "life-adhd",
    title: (lifeAdhd as StudyContent).overall_title,
    modeHint: "ADHD",
    content: lifeAdhd as StudyContent
  },
  {
    id: "civilization-dyslexia",
    title: (civilizationDyslexia as StudyContent).overall_title,
    modeHint: "Dyslexia",
    content: civilizationDyslexia as StudyContent
  },
  {
    id: "central-asia-adhd",
    title: (centralAsiaAdhd as StudyContent).overall_title,
    modeHint: "ADHD",
    content: centralAsiaAdhd as StudyContent
  },
  {
    id: "mlk-adhd",
    title: (mlkAdhd as StudyContent).overall_title,
    modeHint: "ADHD",
    content: mlkAdhd as StudyContent
  },
  {
    id: "turkic-empires-dyslexia",
    title: (turkicEmpiresDyslexia as StudyContent).overall_title,
    modeHint: "Dyslexia",
    content: turkicEmpiresDyslexia as StudyContent
  }
];

export default function ImportPage(): JSX.Element {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [profileFilter, setProfileFilter] = useState<TopicProfile>("ADHD");
  const [selectedTopicId, setSelectedTopicId] = useState<string>(demoTopics[0]?.id ?? "");

  const filteredTopics = useMemo(
    () => demoTopics.filter((topic) => topic.modeHint === profileFilter),
    [profileFilter]
  );

  useEffect(() => {
    const existsInFiltered = filteredTopics.some((topic) => topic.id === selectedTopicId);
    if (!existsInFiltered && filteredTopics[0]) {
      setSelectedTopicId(filteredTopics[0].id);
    }
  }, [filteredTopics, selectedTopicId]);

  const selectedTopic = filteredTopics.find((topic) => topic.id === selectedTopicId) ?? filteredTopics[0] ?? null;

  const goToReader = () => {
    router.push("/reader");
  };

  const loadTopic = (topic: DemoTopic, rawInput: string) => {
    seedSessionWithContent(topic.content, rawInput.trim() ? "import" : "demo", rawInput);
    goToReader();
  };

  const handleGenerate = () => {
    if (!text.trim()) {
      setError("Вставьте текст страницы, чтобы сымитировать генерацию.");
      return;
    }
    if (!selectedTopic) {
      setError("Нет доступных тем для выбранного режима.");
      return;
    }
    loadTopic(selectedTopic, text);
  };

  const handleLoadDemo = () => {
    setError(null);
    if (!selectedTopic) {
      setError("Нет доступных тем для выбранного режима.");
      return;
    }
    loadTopic(selectedTopic, "");
  };

  const filterButtonClass = (active: boolean) =>
    `rounded-xl px-4 py-2 text-sm font-semibold transition ${
      active ? "bg-calm-700 text-white" : "bg-white text-calm-800 hover:bg-calm-100 border border-calm-200"
    }`;

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <section className="rounded-3xl border border-calm-200 bg-white p-6 shadow-soft sm:p-8">
        <h1 className="text-2xl font-bold text-calm-900">Import</h1>
        <p className="mt-2 text-sm text-calm-700">
          Вставьте текст страницы и нажмите «Сгенерировать». Для демо используется локальный JSON-контент.
        </p>

        <div className="mt-6 rounded-2xl border border-calm-200 bg-calm-50 p-4">
          <p className="text-sm font-semibold text-calm-900">Подбор темы по режиму</p>
          <p className="mt-1 text-sm text-calm-700">Выберите режим, и список покажет только подходящие темы.</p>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Фильтр тем по режиму">
            <button
              type="button"
              onClick={() => setProfileFilter("ADHD")}
              className={filterButtonClass(profileFilter === "ADHD")}
              aria-pressed={profileFilter === "ADHD"}
            >
              СДВГ
            </button>
            <button
              type="button"
              onClick={() => setProfileFilter("Dyslexia")}
              className={filterButtonClass(profileFilter === "Dyslexia")}
              aria-pressed={profileFilter === "Dyslexia"}
            >
              Дислексия
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {filteredTopics.map((topic) => {
              const active = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    if (error) {
                      setError(null);
                    }
                  }}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active ? "border-calm-500 bg-white" : "border-calm-200 bg-white/70 hover:bg-white"
                  }`}
                  aria-pressed={active}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-calm-900">{topic.title}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                        topic.modeHint === "ADHD" ? "bg-calm-100 text-calm-800" : "bg-warm-100 text-amber-800"
                      }`}
                    >
                      {topic.modeHint === "ADHD" ? "СДВГ" : "Дислексия"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-calm-600">
                    Секции: {topic.content.sections.length} • Финальный тест: {topic.content.final_test.length}
                  </p>
                </button>
              );
            })}
          </div>

          {filteredTopics.length === 0 ? (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              Для выбранного режима пока нет тем.
            </p>
          ) : null}
        </div>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-semibold text-calm-800">Вставить текст страницы</span>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) {
                setError(null);
              }
            }}
            rows={12}
            placeholder="Вставьте сюда текст отсканированной страницы..."
            className="w-full rounded-2xl border border-calm-200 bg-calm-50 px-4 py-3 text-sm text-calm-900 outline-none ring-0 transition placeholder:text-calm-400 focus:border-calm-400"
          />
        </label>

        {error ? <p className="mt-3 text-sm font-medium text-rose-700">{error}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            className="rounded-2xl bg-calm-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-calm-800"
          >
            Сгенерировать
          </button>
          <button
            type="button"
            onClick={handleLoadDemo}
            className="rounded-2xl border border-calm-200 bg-calm-50 px-5 py-3 text-sm font-semibold text-calm-800 transition hover:bg-calm-100"
          >
            Загрузить выбранную тему
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-calm-200 bg-calm-50 p-6">
        <h2 className="text-lg font-semibold text-calm-900">Как это работает в демо</h2>
        <p className="mt-2 text-sm leading-6 text-calm-700">
          В этой версии приложение работает полностью локально: контент и тесты берутся из файлов в `src/data`, без API и ключей.
        </p>
      </section>
    </div>
  );
}
