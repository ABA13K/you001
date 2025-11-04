// app/search/search-client.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchContent from './search-content'
import { SearchResultsLoading } from '@/components/products/products-loading'

// This component uses useSearchParams and must be wrapped in Suspense
function SearchClientInner() {
  const searchParams = useSearchParams()
  
  return <SearchContent searchParams={searchParams} />
}

// Wrap the component that uses useSearchParams in Suspense
export default function SearchClient() {
  return (
    <Suspense fallback={<SearchResultsLoading count={12} />}>
      <SearchClientInner />
    </Suspense>
  )
}