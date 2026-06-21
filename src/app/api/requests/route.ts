import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

const schema = z.object({
  sourceCountry: z.string().min(1, "کشور مبدأ را وارد کنید"),
  sourceCurrency: z.string().min(1, "ارز مبدأ را وارد کنید"),
  amount: z.string().min(1, "مقدار ارز را وارد کنید"),
  platform: z.string().min(1, "پلتفرم نگهداری ارز را وارد کنید"),
  destCountry: z.string().min(1, "کشور مقصد را وارد کنید"),
  destCurrency: z.string().min(1, "ارز مقصد را وارد کنید"),
  cashDelivery: z.boolean().default(false),
  contactMethod: z.enum(["telegram", "whatsapp", "bale", "phone"]),
  contactValue: z.string().min(3, "راه ارتباطی را وارد کنید"),
  note: z.string().optional(),
});

// ثبت درخواست جدید انتقال ارز (نیاز به ورود نیست — مهمان هم می‌تواند ثبت کند)
export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "برای ثبت درخواست ابتدا وارد شوید" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" },
      { status: 400 }
    );
  }

  const request = await prisma.transferRequest.create({
    data: {
      ...parsed.data,
      note: parsed.data.note?.trim() || null,
      userId,
    },
  });

  return NextResponse.json({ ok: true, id: request.id });
}

// فهرست درخواست‌های کاربر وارد شده
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const requests = await prisma.transferRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}
