// app/search/page.tsx
import SearchClient from './search-client'
import { Metadata } from 'next'

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Search Products',
    description: 'Search and filter products in our store',
  }
}

// This is a server component that renders the client component
export default function SearchPage() {
  return <SearchClient />
}