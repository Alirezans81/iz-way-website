import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CONTACT_METHOD_LABELS } from "@/lib/constants";
import { LogoutButton } from "@/components/LogoutButton";

const STATUS_LABELS: Record<string, { text: string; cls: string }> = {
  pending: { text: "در انتظار بررسی", cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  reviewing: { text: "در حال بررسی", cls: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" },
  done: { text: "انجام شد", cls: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300" },
  rejected: { text: "رد شد", cls: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300" },
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const requests = await prisma.transferRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-wine-900 dark:text-wine-100">
            {user.firstName} {user.lastName}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400" dir="ltr">
            {user.email}
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* اطلاعات کاربر */}
      <div className="card mt-8">
        <h2 className="mb-4 text-base font-bold text-wine-800 dark:text-wine-200">اطلاعات حساب</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-gray-400 dark:text-neutral-500">نام و نام خانوادگی</dt>
            <dd className="mt-1 text-sm text-gray-800 dark:text-neutral-200">
              {user.firstName} {user.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-400 dark:text-neutral-500">ایمیل</dt>
            <dd className="mt-1 text-sm text-gray-800 dark:text-neutral-200" dir="ltr">
              {user.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-400 dark:text-neutral-500">شماره موبایل</dt>
            <dd className="mt-1 text-sm text-gray-800 dark:text-neutral-200" dir="ltr">
              {user.phoneCountry} {user.phoneNumber}
            </dd>
          </div>
        </dl>
      </div>

      {/* درخواست‌ها */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-bold text-wine-900 dark:text-wine-100">درخواست‌های من</h2>
        <Link href="/request" className="btn-primary">
          درخواست جدید
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="card mt-4 text-center text-sm text-gray-500 dark:text-neutral-400">
          هنوز درخواستی ثبت نکرده‌ای.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {requests.map((r) => {
            const status = STATUS_LABELS[r.status] ?? STATUS_LABELS.pending;
            return (
              <div key={r.id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                    {r.amount} {r.sourceCurrency} → {r.destCurrency}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${status.cls}`}
                  >
                    {status.text}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-neutral-400 sm:grid-cols-2">
                  <p>از: {r.sourceCountry} ({r.platform})</p>
                  <p>به: {r.destCountry}</p>
                  <p>تحویل نقدی: {r.cashDelivery ? "بله (مشهد)" : "خیر"}</p>
                  <p>
                    تماس: {CONTACT_METHOD_LABELS[r.contactMethod] ?? r.contactMethod}{" "}
                    — <span dir="ltr">{r.contactValue}</span>
                  </p>
                </div>
                <p className="mt-3 text-xs text-gray-400 dark:text-neutral-500">
                  {new Date(r.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
