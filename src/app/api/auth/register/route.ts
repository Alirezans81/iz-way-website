import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  firstName: z.string().min(1, "نام را وارد کنید"),
  lastName: z.string().min(1, "نام خانوادگی را وارد کنید"),
  phoneCountry: z.string().min(1, "کد کشور را انتخاب کنید"),
  phoneNumber: z.string().min(4, "شماره موبایل معتبر نیست"),
});

export async function POST(req: Request) {
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

  const data = parsed.data;
  const email = data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "این ایمیل قبلاً ثبت شده است" },
      { status: 409 }
    );
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(data.password),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phoneCountry: data.phoneCountry,
      phoneNumber: data.phoneNumber.trim(),
    },
  });

  await createSession(user.id);

  return NextResponse.json({ ok: true });
}
