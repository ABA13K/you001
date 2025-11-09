// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SearchProvider } from '@/context/search-context'
import { AuthProvider } from '@/context/auth-context'
import { Suspense } from 'react'
import Header from '@/components/layout/header'

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
        <AuthProvider>
          <SearchProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Header />
              <main>
                {children}
              </main>
            </Suspense>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  )
}