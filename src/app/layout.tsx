import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { AppHeader } from "@/components/app-header";

export const metadata: Metadata = {
  title: "NeuroFlow Demo",
  description: "Scan page -> Focus Reader -> mini tests -> final test"
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="ru">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-calm-800 focus:px-4 focus:py-2 focus:text-white"
        >
          Перейти к содержимому
        </a>
        <AppHeader />
        <main id="main-content" className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
