import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/authContext"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "LearnBridge - Your Learning Platform",
  description: "Connect with expert tutors and access quality learning resources",
  generator: "Satoshii",
  icons: {
    icon: "/logo.jpg",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">

        <AuthProvider>        
          <ScrollToTop />
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}