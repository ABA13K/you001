// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SearchProvider } from '@/context/search-context'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your Ecommerce Store',
  description: 'Modern ecommerce built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SearchProvider>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </SearchProvider>
      </body>
    </html>
  )
}