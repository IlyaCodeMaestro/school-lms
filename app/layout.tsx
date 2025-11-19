import type { Metadata } from "next";
import { Geist, Geist_Mono } from 'next/font/google';
import "./globals.css";
import { ToastProvider } from '@/components/toast-provider';
import { ToastContainer } from '@/components/toast-container';

const _geistSans = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "School LMS - Portfolio",
  description: "Educational activity feed for tracking student achievements",
    generator: 'v0.app'
};

export const viewport = {
  themeColor: "#4F46E5",
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  )
}
