import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PublicOS 2.0",
  description: "空間オペレーティングシステム - 物理AIシミュレーターから自律型空間プラットフォームへ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
