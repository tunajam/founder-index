import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { PostHogProvider } from "@/components/posthog-provider"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "Founder Index — Network Effects × Founder-Led Stock Screener",
  description: "Filter S&P 500 stocks by network effects and founder leadership. Backtested to 29% returns vs 8.4% S&P 500.",
  openGraph: {
    title: "Founder Index",
    description: "S&P 500 screener: Network Effects × Founder-Led. 29% backtested returns.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Founder Index",
    description: "S&P 500 screener: Network Effects × Founder-Led. 29% backtested returns.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans antialiased bg-stone-950`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
