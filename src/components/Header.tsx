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
      <Link href="/" className="text-gray-600 hover:text-wine-700 dark:text-neutral-300 dark:hover:text-wine-300" onClick={() => setOpen(false)}>
        خانه
      </Link>
      <Link href="/request" className="text-gray-600 hover:text-wine-700 dark:text-neutral-300 dark:hover:text-wine-300" onClick={() => setOpen(false)}>
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
    <header className="sticky top-0 z-30 border-b border-wine-100 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />

        {/* دسکتاپ */}
        <nav className="hidden items-center gap-6 md:flex">{navLinks}</nav>
        <div className="hidden items-center gap-3 md:flex">
          {authLinks}
          <ThemeToggle />
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
        <div className="md:hidden border-t border-wine-100 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950">
          <nav className="flex flex-col gap-4">{navLinks}</nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-neutral-800">
            {authLinks}
          </div>
        </div>
      )}
    </header>
  );
}
