import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Cormorant_Garamond } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Conciencia UI",
  description: "Interfaces vivas y críticas. UI que observa, evalúa, y decide.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="texture-noise">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${cormorant.variable}
          antialiased
          bg-living
        `}
      >
        {children}
      </body>
    </html>
  )
}
