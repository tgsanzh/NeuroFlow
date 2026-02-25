"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { resetSession } from "@/lib/storage";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/import", label: "Import" },
  { href: "/reader", label: "Reader" },
  { href: "/final-test", label: "Final Test" },
  { href: "/results", label: "Results" }
];

export function AppHeader(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  const handleReset = () => {
    if (!window.confirm("Сбросить текущую сессию чтения и тестов?")) {
      return;
    }
    resetSession();
    router.push("/import");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-calm-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-xl bg-calm-100 px-3 py-2 text-sm font-semibold text-calm-800">
            NeuroFlow Demo
          </Link>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    active ? "bg-calm-700 text-white" : "bg-calm-50 text-calm-700 hover:bg-calm-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Reset session
        </button>
      </div>
    </header>
  );
}
