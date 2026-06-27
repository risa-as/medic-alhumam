import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { Providers } from "./providers";
import { ourFileRouter } from "@/lib/uploadthing";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-app",
});

export const metadata: Metadata = {
  title: "نظام إدارة متجر المستلزمات الطبية",
  description: "إدارة المخزون والبيع والديون والمتجر الإلكتروني",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
