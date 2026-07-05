"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PHONE_COUNTRY_CODES } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneCountry: "+98",
    phoneNumber: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nextSuffix, setNextSuffix] = useState("");

  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    if (n) setNextSuffix(`?next=${encodeURIComponent(n)}`);
  }, []);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    <div className="w-full mx-auto max-w-md px-4 py-16">
      <div className="card">
        <h1 className="text-xl font-bold text-brand-500">ساخت حساب کاربری</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          چند ثانیه طول می‌کشد.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="field">
              <label className="label">نام</label>
              <input
                className="input"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label">نام خانوادگی</label>
              <input
                className="input"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">ایمیل</label>
            <input
              type="email"
              dir="ltr"
              className="input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="label">شماره موبایل</label>
            <div className="flex gap-2" dir="ltr">
              <select
                className="input w-32 flex-shrink-0"
                value={form.phoneCountry}
                onChange={(e) => update("phoneCountry", e.target.value)}
              >
                {PHONE_COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <input
                className="input"
                inputMode="tel"
                placeholder="9123456789"
                value={form.phoneNumber}
                onChange={(e) => update("phoneNumber", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">رمز عبور</label>
            <input
              type="password"
              dir="ltr"
              className="input"
              placeholder="حداقل ۶ کاراکتر"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500 dark:text-neutral-400">
          قبلاً ثبت‌نام کرده‌ای؟{" "}
          <Link href={`/login${nextSuffix}`} className="font-medium text-wine-700 hover:underline dark:text-wine-300">
            وارد شو
          </Link>
        </p>
      </div>
    </div>
  );
}
