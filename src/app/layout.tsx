import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "ایزی وِی | انتقال ارز بین ایران و سایر کشورها",
  description:
    "انتقال امن و سریع ارز از ایران به سایر کشورها و بالعکس. ثبت درخواست آنلاین.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header
          isLoggedIn={!!user}
          userName={user ? `${user.firstName} ${user.lastName}` : null}
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
