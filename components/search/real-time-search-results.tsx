// components/search/real-time-search-results.tsx
'use client'

import { SearchProduct } from '@/types/search'
import Link from 'next/link'
import { Search, TrendingUp, Clock } from 'lucide-react'

interface RealTimeSearchResultsProps {
  results: SearchProduct[]
  query: string
  isLoading: boolean
  onSelect: () => void
  recentSearches: string[]
  onRecentSearchSelect: (search: string) => void
}

export default function RealTimeSearchResults({
  results,
  query,
  isLoading,
  onSelect,
  recentSearches,
  onRecentSearchSelect
}: RealTimeSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-sm text-gray-600 mt-2">Searching for{query}</p>
      </div>
    )
  }

  if (results.length > 0) {
    return (
      <div className="p-2">
        <div className="flex items-center px-2 py-1 text-sm font-semibold text-gray-700 mb-2">
          <TrendingUp className="w-4 h-4 mr-2" />
          Found {results.length} products
        </div>
        {results.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0 group"
            onClick={onSelect}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 rounded object-cover mr-3 flex-shrink-0 border border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                {product.name}
              </p>
              <p className="text-sm text-gray-500 font-semibold">
                ${product.original_price}
              </p>
            </div>
            <div className="text-xs text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </div>
          </Link>
        ))}
      </div>
    )
  }

  if (query.length >= 2 && results.length === 0) {
    return (
      <div className="p-4 text-center">
        <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-600">No products found for</p>
        <p className="text-sm font-medium text-gray-900">{query}</p>
        <p className="text-xs text-gray-500 mt-1">Try different keywords or check spelling</p>
      </div>
    )
  }

  if (recentSearches.length > 0 && query.length < 2) {
    return (
      <div className="p-2">
        <div className="flex items-center px-2 py-1 text-sm font-semibold text-gray-700 mb-2">
          <Clock className="w-4 h-4 mr-2" />
          Recent Searches
        </div>
        {recentSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => onRecentSearchSelect(search)}
            className="w-full text-left flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0 group"
          >
            <Clock className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate group-hover:text-blue-600">{search}</span>
          </button>
        ))}
      </div>
    )
  }

  return null
}