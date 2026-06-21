import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { RequestForm } from "./RequestForm";

// ثبت درخواست فقط برای کاربران ثبت‌نام‌شده — در غیر این صورت به صفحه ورود هدایت می‌شود
export default async function RequestPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login?next=/request");
  }

  return <RequestForm />;
}
