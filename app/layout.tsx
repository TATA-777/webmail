import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "웹메일 | Zero-Watch",
  description: "Zero-Watch 자체 제작 웹메일",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans">{children}</body>
    </html>
  );
}
