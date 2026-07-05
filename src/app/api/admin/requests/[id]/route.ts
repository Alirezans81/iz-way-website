// src/app/api/admin/requests/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = ["pending", "reviewing", "done", "rejected"] as const;
type RequestStatus = (typeof ALLOWED_STATUSES)[number];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const searchParams = req.nextUrl.searchParams;
  const password = searchParams.get("password");

  if (!password || password !== process.env.ADMIN_PAGE_PASSWORD) {
    return NextResponse.json({ error: "دسترسی غیرمجاز!" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const nextStatus = body.status as RequestStatus | undefined;

    if (!nextStatus || !ALLOWED_STATUSES.includes(nextStatus)) {
      return NextResponse.json(
        { error: "وضعیت ارسالی نامعتبر است." },
        { status: 400 },
      );
    }

    const requestItem = await prisma.transferRequest.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!requestItem) {
      return NextResponse.json({ error: "درخواست پیدا نشد." }, { status: 404 });
    }

    const currentStatus = requestItem.status;

    // قوانین تغییر وضعیت
    const isValidTransition =
      (currentStatus === "pending" &&
        (nextStatus === "reviewing" || nextStatus === "rejected")) ||
      (currentStatus === "reviewing" && nextStatus === "done") ||
      (currentStatus === "done" && nextStatus === "reviewing");

    if (!isValidTransition) {
      return NextResponse.json(
        {
          error: `تغییر وضعیت از "${currentStatus}" به "${nextStatus}" مجاز نیست.`,
        },
        { status: 400 },
      );
    }

    const updated = await prisma.transferRequest.update({
      where: { id },
      data: {
        status: nextStatus,
      },
    });

    return NextResponse.json({
      success: true,
      request: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/requests/[id] error:", error);
    return NextResponse.json(
      { error: "خطا در بروزرسانی وضعیت درخواست." },
      { status: 500 },
    );
  }
}
