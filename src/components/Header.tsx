"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  isLoggedIn: boolean;
  userName: string | null;
};

export function Header({ isLoggedIn, userName }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const navLinks = (
    <>
      <Link href="/" className="text-charcoal-600 hover:text-brand-600 dark:text-neutral-300 dark:hover:text-brand-300" onClick={() => setOpen(false)}>
        خانه
      </Link>
      <Link href="/request" className="text-charcoal-600 hover:text-brand-600 dark:text-neutral-300 dark:hover:text-brand-300" onClick={() => setOpen(false)}>
        ثبت درخواست
      </Link>
    </>
  );

  const authLinks = isLoggedIn ? (
    <>
      <Link href="/profile" className="btn-outline" onClick={() => setOpen(false)}>
        {userName ?? "پروفایل"}
      </Link>
      <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-wine-700 dark:text-neutral-400 dark:hover:text-wine-300">
        خروج
      </button>
    </>
  ) : (
    <>
      <Link href="/login" className="btn-outline" onClick={() => setOpen(false)}>
        ورود
      </Link>
      <Link href="/register" className="btn-primary" onClick={() => setOpen(false)}>
        ثبت‌نام
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-wine-200/50 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-charcoal-900/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />

        {/* دسکتاپ */}
        <nav className="hidden items-center gap-6 md:flex">{navLinks}</nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {authLinks}
        </div>

        {/* موبایل */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-wine-100 text-wine-700 dark:border-neutral-700 dark:text-neutral-200"
            onClick={() => setOpen((o) => !o)}
            aria-label="منو"
          >
            <span className="text-xl">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-wine-200/50 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-charcoal-900/80">
          <nav className="flex flex-col gap-4">{navLinks}</nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-wine-200/40 pt-4 dark:border-white/10">
            {authLinks}
          </div>
        </div>
      )}
    </header>
  );
}
