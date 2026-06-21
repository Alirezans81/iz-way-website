// داده‌های مشترک فرم‌ها — به‌راحتی قابل توسعه

export const CONTACT_METHODS = [
  { value: "telegram", label: "تلگرام" },
  { value: "whatsapp", label: "واتساپ" },
  { value: "bale", label: "بله" },
  { value: "phone", label: "تماس مستقیم" },
] as const;

export type ContactMethod = (typeof CONTACT_METHODS)[number]["value"];

export const CONTACT_METHOD_LABELS: Record<string, string> = Object.fromEntries(
  CONTACT_METHODS.map((m) => [m.value, m.label])
);

// پیشنهادهای پرکاربرد برای ارز (کاربر می‌تواند مقدار دلخواه هم وارد کند)
export const CURRENCY_SUGGESTIONS = [
  "تومان / ریال (IRR)",
  "دلار آمریکا (USD)",
  "یورو (EUR)",
  "پوند (GBP)",
  "درهم امارات (AED)",
  "لیر ترکیه (TRY)",
  "دلار کانادا (CAD)",
  "دلار استرالیا (AUD)",
  "تتر (USDT)",
];

// کدهای کشور برای شماره موبایل — لیست کوتاهِ پرکاربرد، قابل توسعه
export const PHONE_COUNTRY_CODES = [
  { code: "+98", label: "ایران (+98)" },
  { code: "+971", label: "امارات (+971)" },
  { code: "+90", label: "ترکیه (+90)" },
  { code: "+1", label: "آمریکا/کانادا (+1)" },
  { code: "+44", label: "انگلستان (+44)" },
  { code: "+49", label: "آلمان (+49)" },
  { code: "+33", label: "فرانسه (+33)" },
  { code: "+61", label: "استرالیا (+61)" },
  { code: "+7", label: "روسیه (+7)" },
  { code: "+86", label: "چین (+86)" },
];
