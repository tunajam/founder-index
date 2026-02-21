import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Founder Index — Real Backtest Data",
  description: "Founder-led companies with network effects outperform the market.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
