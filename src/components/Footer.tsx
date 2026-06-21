import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-wine-100 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-500 dark:text-neutral-400 md:flex-row">
        <p>© {new Date().getFullYear()} ایزی وِی — انتقال ارز</p>
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="hover:text-wine-700 dark:hover:text-wine-300"
          >
            خانه
          </Link>
          <Link
            href="/request"
            className="hover:text-wine-700 dark:hover:text-wine-300"
          >
            ثبت درخواست
          </Link>
          <Link
            href="/login"
            className="hover:text-wine-700 dark:hover:text-wine-300"
          >
            ورود
          </Link>
        </div>
      </div>
    </footer>
  );
}
