import Link from "next/link";

const steps = [
  {
    title: "ثبت درخواست",
    desc: "ارز، مبلغ، پلتفرم و مقصد دلخواهت را در یک فرم ساده وارد کن.",
  },
  {
    title: "بررسی و هماهنگی",
    desc: "کارشناسان ما از طریق راه ارتباطی انتخابی‌ات با تو هماهنگ می‌کنند.",
  },
  {
    title: "انتقال و تحویل",
    desc: "ارز به‌صورت امن منتقل و در مقصد (یا نقدی در مشهد) تحویل می‌شود.",
  },
];

const features = [
  { title: "دو طرفه", desc: "از ایران به سایر کشورها و بالعکس." },
  { title: "هر پلتفرمی", desc: "Wise، PayPal، حساب بانکی و هر پلتفرم دلخواه." },
  { title: "تحویل نقدی در مشهد", desc: "امکان دریافت نقدی به‌صورت حضوری." },
  { title: "ساده و شفاف", desc: "بدون پیچیدگی، با هماهنگی مستقیم." },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-600 backdrop-blur dark:border-brand-400/30 dark:text-brand-100">
              انتقال ارز، ساده و مطمئن
            </span>
            <h1 className="mt-6 text-3xl font-extrabold leading-tight text-brand-500 drop-shadow-sm md:text-5xl">
              انتقال ارز بین ایران و سایر کشورها
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-charcoal-600 dark:text-neutral-300 md:text-lg">
              پولت در هر کشوری و روی هر پلتفرمی که باشد، آن را به ارز و مقصد دلخواهت
              منتقل می‌کنیم. کافی است یک درخواست ثبت کنی.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/request" className="btn-primary w-full sm:w-auto">
                ثبت درخواست انتقال
              </Link>
              <Link href="/register" className="btn-outline w-full sm:w-auto">
                ساخت حساب کاربری
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* مزایا */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card">
              <h3 className="font-bold text-wine-800 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-600 dark:text-neutral-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* مراحل */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-brand-500 md:text-3xl">
          چطور کار می‌کند؟
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="card relative">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg shadow-brand-500/30" style={{ backgroundImage: "linear-gradient(135deg, #d52a2a 0%, #3f1212 100%)" }}>
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-wine-800 dark:text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-600 dark:text-neutral-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-12 text-center text-white shadow-2xl shadow-wine-900/30 md:py-16"
          style={{
            backgroundImage:
              "radial-gradient(100% 120% at 0% 0%, rgba(213,42,42,0.55), transparent 60%), linear-gradient(135deg, #3f1212 0%, #2a0f0f 55%, #343434 100%)",
          }}
        >
          <h2 className="text-2xl font-bold md:text-3xl">آماده‌ای انتقال را شروع کنی؟</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            همین حالا درخواستت را ثبت کن تا در سریع‌ترین زمان با تو هماهنگ کنیم.
          </p>
          <Link
            href="/request"
            className="btn mt-6 bg-white text-wine-900 hover:bg-brand-50"
          >
            ثبت درخواست
          </Link>
        </div>
      </section>
    </div>
  );
}
