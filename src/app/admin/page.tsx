import { TransferRequest } from "@prisma/client";
import Link from "next/link";
import { CONTACT_METHOD_LABELS, STATUS_LABELS } from "@/lib/constants";
import RequestActions from "./RequestActions";

type AdminRequestsResponse = {
  requests: TransferRequest[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{
    password?: string;
    page?: string;
    limit?: string;
    status?: string;
  }>;
}) {
  const {
    password,
    page = "1",
    limit = "10",
    status = "",
  } = await searchParams;

  if (!password || password !== process.env.ADMIN_PAGE_PASSWORD) {
    return (
      <div className="my-auto flex w-full flex-col items-center justify-center gap-4 py-20">
        <span className="text-2xl font-bold text-brand-500">
          شما به این صفحه دسترسی ندارید!
        </span>
        <Link href="/" className="btn-primary">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    );
  }

  try {
    const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
    const fetchUrl = new URL("/api/admin/requests", baseUrl);

    fetchUrl.searchParams.set("password", password);
    fetchUrl.searchParams.set("page", page);
    fetchUrl.searchParams.set("limit", limit);
    if (status) fetchUrl.searchParams.set("status", status);

    const res = await fetch(fetchUrl.toString(), {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`خطا در ارتباط با سرور: ${res.status}`);
    }

    const result: AdminRequestsResponse = await res.json();
    const { requests, meta } = result;

    const currentPage = meta.page;
    const currentLimit = meta.limit;

    const fromItem = meta.total > 0 ? (currentPage - 1) * currentLimit + 1 : 0;
    const toItem = Math.min(currentPage * currentLimit, meta.total);

    const buildHref = (overrides: {
      page?: number;
      limit?: number;
      status?: string;
    }) => {
      const params = new URLSearchParams();
      params.set("password", password);

      const newPage =
        overrides.page !== undefined ? overrides.page : currentPage;
      const newLimit =
        overrides.limit !== undefined ? overrides.limit : currentLimit;
      const newStatus =
        overrides.status !== undefined ? overrides.status : status;

      params.set("page", String(newPage));
      params.set("limit", String(newLimit));
      if (newStatus) {
        params.set("status", newStatus);
      }

      return `/admin?${params.toString()}`;
    };

    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-brand-500">
            لیست درخواست‌ها (مدیریت)
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
              وضعیت:
            </span>

            <div className="flex gap-1 rounded-lg bg-gray-200/50 p-1 dark:bg-neutral-800/50">
              {[
                { value: "", label: "همه" },
                { value: "pending", label: "در انتظار" },
                { value: "reviewing", label: "در حال انجام" },
                { value: "done", label: "انجام شده" },
                { value: "rejected", label: "رد شده" },
              ].map((opt) => (
                <Link
                  key={opt.value}
                  href={buildHref({ status: opt.value, page: 1 })}
                  className={`rounded-md px-3 py-1 text-xs transition ${
                    status === opt.value
                      ? "bg-white font-semibold text-gray-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                      : "text-gray-600 hover:text-gray-950 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
              تعداد نمایش:
            </span>

            <div className="flex gap-1 rounded-lg bg-gray-200/50 p-1 dark:bg-neutral-800/50">
              {[5, 10, 25, 50].map((size) => (
                <Link
                  key={size}
                  href={buildHref({ limit: size, page: 1 })}
                  className={`rounded-md px-2 py-0.5 text-xs transition ${
                    currentLimit === size
                      ? "bg-white font-semibold text-gray-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                      : "text-gray-600 hover:text-gray-950 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {size}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="card mt-4 py-12 text-center text-sm text-gray-500 dark:text-neutral-400">
            هیچ درخواستی با این مشخصات یافت نشد.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => {
              const statusLabel =
                STATUS_LABELS[r.status] ?? STATUS_LABELS.pending;

              return (
                <div key={r.id} className="card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                      {r.amount} {r.sourceCurrency} → {r.destCurrency}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusLabel.cls}`}
                    >
                      {statusLabel.text}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-neutral-400 sm:grid-cols-2">
                    <p>
                      از: {r.sourceCountry} ({r.platform})
                    </p>
                    <p>به: {r.destCountry}</p>
                    <p>تحویل نقدی: {r.cashDelivery ? "بله (مشهد)" : "خیر"}</p>
                    <p>
                      تماس:{" "}
                      {CONTACT_METHOD_LABELS[r.contactMethod] ??
                        r.contactMethod}{" "}
                      — <span dir="ltr">{r.contactValue}</span>
                    </p>
                  </div>

                  <p className="mt-3 text-xs text-gray-400 dark:text-neutral-500">
                    {new Date(r.createdAt).toLocaleDateString("fa-IR")}
                  </p>

                  <RequestActions requestId={r.id} status={r.status} />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-neutral-800">
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            {meta.total > 0
              ? `نمایش ${fromItem} تا ${toItem} از ${meta.total} مورد`
              : "موردی برای نمایش نیست"}
          </span>

          <div className="flex gap-2">
            <Link
              href={buildHref({ page: currentPage - 1 })}
              className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                !meta.hasPrevPage
                  ? "pointer-events-none cursor-not-allowed bg-gray-100 text-gray-400 opacity-40 dark:bg-neutral-800"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
              }`}
              aria-disabled={!meta.hasPrevPage}
            >
              صفحه قبل
            </Link>

            <Link
              href={buildHref({ page: currentPage + 1 })}
              className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                !meta.hasNextPage
                  ? "pointer-events-none cursor-not-allowed bg-gray-100 text-gray-400 opacity-40 dark:bg-neutral-800"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
              }`}
              aria-disabled={!meta.hasNextPage}
            >
              صفحه بعد
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("خطا در صفحه درخواست‌ها:", error);

    return (
      <div className="w-full py-12 text-center font-bold text-red-500">
        مشکلی پیش اومده؛ احتمالاً BASE_URL را در فایل env تعریف نکرده‌ای یا سرور
        API بالا نیست.
      </div>
    );
  }
}
