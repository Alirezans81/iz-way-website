"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="تغییر حالت تاریک/روشن"
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-wine-100 text-wine-700 transition-colors hover:bg-wine-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
    >
      {/* تا قبل از mount چیزی نشان نده تا hydration mismatch رخ ندهد */}
      <span className="text-lg">{mounted ? (dark ? "☀️" : "🌙") : ""}</span>
    </button>
  );
}
