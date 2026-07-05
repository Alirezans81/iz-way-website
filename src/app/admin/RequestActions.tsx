"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  requestId: string;
  status: string;
};

export default function RequestActions({ requestId, status }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const password = searchParams.get("password");

  const updateStatus = async (nextStatus: string) => {
    if (!password) {
      alert("پسورد ادمین در URL پیدا نشد.");
      return;
    }

    try {
      setLoadingAction(nextStatus);

      const res = await fetch(
        `/api/admin/requests/${requestId}?password=${encodeURIComponent(password)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "خطا در انجام عملیات");
      }

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "خطای ناشناخته رخ داد";
      alert(message);
    } finally {
      setLoadingAction(null);
    }
  };

  if (status === "pending") {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateStatus("reviewing")}
          disabled={loadingAction !== null}
          className="rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "reviewing" ? "در حال تایید..." : "تایید درخواست"}
        </button>

        <button
          type="button"
          onClick={() => updateStatus("rejected")}
          disabled={loadingAction !== null}
          className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "rejected" ? "در حال رد..." : "رد درخواست"}
        </button>
      </div>
    );
  }

  if (status === "reviewing") {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateStatus("done")}
          disabled={loadingAction !== null}
          className="rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "done" ? "در حال اتمام..." : "اتمام معامله"}
        </button>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateStatus("reviewing")}
          disabled={loadingAction !== null}
          className="rounded-lg bg-yellow-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "done"
            ? "در حال اتمام..."
            : "برگشت به در حال انجام"}
        </button>
      </div>
    );
  }

  return null;
}
