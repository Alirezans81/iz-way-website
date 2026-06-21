import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-wine-200/50 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-charcoal-900/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-charcoal-500 dark:text-neutral-400 md:flex-row">
        <p>© {new Date().getFullYear()} ایزی وِی — انتقال ارز</p>
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="hover:text-brand-600 dark:hover:text-brand-300"
          >
            خانه
          </Link>
          <Link
            href="/request"
            className="hover:text-brand-600 dark:hover:text-brand-300"
          >
            ثبت درخواست
          </Link>
          <Link
            href="/login"
            className="hover:text-brand-600 dark:hover:text-brand-300"
          >
            ورود
          </Link>
        </div>
      </div>
    </footer>
  );
}
