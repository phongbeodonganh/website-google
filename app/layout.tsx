import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ad Intelligence & Analytics Platform",
  description: "Tra cứu & phân tích quảng cáo Google Ads Transparency Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
