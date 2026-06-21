import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-wine-700 text-base font-bold text-white">
        IZ
      </span>
      <span className="text-lg font-bold text-wine-800 dark:text-white">
        ایزی وِی
      </span>
    </Link>
  );
}
