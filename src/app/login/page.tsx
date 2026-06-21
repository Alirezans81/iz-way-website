"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nextSuffix, setNextSuffix] = useState("");

  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    if (n) setNextSuffix(`?next=${encodeURIComponent(n)}`);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطایی رخ داد");
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/") ? next : "/profile");
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card">
        <h1 className="text-xl font-bold text-wine-900 dark:text-wine-100">ورود به حساب</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          خوش آمدی! وارد حسابت شو.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="field">
            <label className="label">ایمیل</label>
            <input
              type="email"
              dir="ltr"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="label">رمز عبور</label>
            <input
              type="password"
              dir="ltr"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500 dark:text-neutral-400">
          حساب نداری؟{" "}
          <Link href={`/register${nextSuffix}`} className="font-medium text-wine-700 hover:underline dark:text-wine-300">
            ثبت‌نام کن
          </Link>
        </p>
      </div>
    </div>
  );
}
