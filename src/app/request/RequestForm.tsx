"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTACT_METHODS, CURRENCY_SUGGESTIONS } from "@/lib/constants";

type FormState = {
  sourceCountry: string;
  sourceCurrency: string;
  amount: string;
  platform: string;
  destCountry: string;
  destCurrency: string;
  cashDelivery: boolean;
  contactMethod: string;
  contactValue: string;
  note: string;
};

const initial: FormState = {
  sourceCountry: "",
  sourceCurrency: "",
  amount: "",
  platform: "",
  destCountry: "",
  destCurrency: "",
  cashDelivery: false,
  contactMethod: "telegram",
  contactValue: "",
  note: "",
};

export function RequestForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطایی رخ داد");
        return;
      }
      setDone(true);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wine-100 text-2xl text-wine-700 dark:bg-wine-900/40 dark:text-white">
            ✓
          </div>
          <h1 className="mt-4 text-xl font-bold text-brand-500">
            درخواستت ثبت شد!
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-neutral-300">
            به‌زودی از طریق راه ارتباطی که وارد کردی با تو هماهنگ می‌کنیم.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/profile" className="btn-outline">
              درخواست‌های من
            </Link>
            <button
              className="btn-primary"
              onClick={() => {
                setForm(initial);
                setDone(false);
              }}
            >
              ثبت درخواست جدید
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-500">
        ثبت درخواست انتقال ارز
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-neutral-300">
        فیلدهای زیر را پر کن تا درخواستت را بررسی کنیم.
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        {/* بخش مبدأ */}
        <div className="card mb-6">
          <h2 className="mb-4 text-base font-bold text-wine-800 dark:text-white">
            ارزی که داری
          </h2>

          <div className="field">
            <label className="label">پولت در چه کشوری است؟</label>
            <input
              className="input"
              placeholder="مثلاً امارات، آلمان، آمریکا..."
              value={form.sourceCountry}
              onChange={(e) => update("sourceCountry", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="field">
              <label className="label">چه ارزی؟</label>
              <input
                className="input"
                list="currency-list"
                placeholder="مثلاً دلار، یورو..."
                value={form.sourceCurrency}
                onChange={(e) => update("sourceCurrency", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label">چه مقدار؟</label>
              <input
                className="input"
                inputMode="decimal"
                placeholder="مثلاً ۱۰۰۰"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field mb-0">
            <label className="label">در چه پلتفرمی نگهداری می‌شود؟</label>
            <input
              className="input"
              placeholder="مثلاً Wise، PayPal، حساب بانکی فلان..."
              value={form.platform}
              onChange={(e) => update("platform", e.target.value)}
              required
            />
          </div>
        </div>

        {/* بخش مقصد */}
        <div className="card mb-6">
          <h2 className="mb-4 text-base font-bold text-wine-800 dark:text-white">
            ارزی که می‌خواهی تحویل بگیری
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="field">
              <label className="label">کجا می‌خواهی انتقال بدهی؟</label>
              <input
                className="input"
                placeholder="کشور مقصد"
                value={form.destCountry}
                onChange={(e) => update("destCountry", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label">چه ارزی تحویل بگیری؟</label>
              <input
                className="input"
                list="currency-list"
                placeholder="ارز مقصد"
                value={form.destCurrency}
                onChange={(e) => update("destCurrency", e.target.value)}
                required
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-wine-50 p-4 dark:bg-wine-950/30">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 accent-wine-700"
              checked={form.cashDelivery}
              onChange={(e) => update("cashDelivery", e.target.checked)}
            />
            <span className="text-sm text-gray-700 dark:text-neutral-300">
              می‌خواهم به‌صورت <b>نقدی</b> تحویل بگیرم
              <span className="mt-1 block text-xs text-gray-500 dark:text-neutral-400">
                تحویل نقدی فقط در شهر مشهد امکان‌پذیر است.
              </span>
            </span>
          </label>
        </div>

        {/* راه ارتباطی */}
        <div className="card mb-6">
          <h2 className="mb-4 text-base font-bold text-wine-800 dark:text-white">
            راه ارتباطی
          </h2>

          <div className="field">
            <label className="label">از چه طریقی با تو در ارتباط باشیم؟</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CONTACT_METHODS.map((m) => (
                <button
                  type="button"
                  key={m.value}
                  onClick={() => update("contactMethod", m.value)}
                  className={`rounded-xl border px-3 py-2.5 text-sm transition ${
                    form.contactMethod === m.value
                      ? "border-wine-600 bg-wine-700 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-wine-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-wine-600"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field mb-0">
            <label className="label">
              {form.contactMethod === "phone" ? "شماره تماس" : "شماره یا آیدی"}
            </label>
            <input
              className="input"
              dir="ltr"
              placeholder={
                form.contactMethod === "telegram"
                  ? "@username یا شماره"
                  : "+98..."
              }
              value={form.contactValue}
              onChange={(e) => update("contactValue", e.target.value)}
              required
            />
          </div>
        </div>

        {/* توضیحات */}
        <div className="field">
          <label className="label">توضیحات اضافه (اختیاری)</label>
          <textarea
            className="input min-h-[90px] resize-y"
            placeholder="هر نکته‌ای که لازم است بدانیم..."
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/15 dark:text-red-300">
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "در حال ثبت..." : "ثبت درخواست"}
        </button>
      </form>

      <datalist id="currency-list">
        {CURRENCY_SUGGESTIONS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </div>
  );
}
