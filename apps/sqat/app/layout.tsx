import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { GNB } from "@/components/GNB";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SQAT — Software QA Tester",
  description: "QA 전문 학습 플랫폼 (학습 · 미션 · 챌린지 · 토론 · 자격증)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 antialiased`}>
        <GNB />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
          <p>
            SQAT (Software QA Tester) · Foundation / Professional ·{" "}
            <Link href="/sqat" className="text-indigo-600 hover:underline">
              자격 안내
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
