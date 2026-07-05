import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// فهرست درخواست‌ها
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // احراز هویت با پسوردِ توی آدرس!
  const password = searchParams.get("password");
  if (!password || password !== process.env.ADMIN_PAGE_PASSWORD) {
    return NextResponse.json(
      { error: "شما به این بخش دسترسی ندارید!" },
      { status: 401 },
    );
  }

  const status = searchParams.get("status");

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(
    1,
    Math.min(100, parseInt(searchParams.get("limit") || "10", 10)),
  );

  const skip = (page - 1) * limit;

  // فیلتر جستجو را تعریف می‌کنیم تا هم در count و هم در findMany یکسان باشد
  const whereClause = status ? { status } : {};

  try {
    // اجرای همزمان دو کوئری برای بالا بردن سرعت (Promise.all دوست صمیمی ماست)
    const [requests, totalCount] = await Promise.all([
      prisma.transferRequest.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: limit,
      }),
      prisma.transferRequest.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      requests,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "مشکلی در دریافت اطلاعات از دیتابیس رخ داد." },
      { status: 500 },
    );
  }
}
