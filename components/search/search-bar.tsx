/* eslint-disable react-hooks/set-state-in-effect */
// components/search/search-bar.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Clock, TrendingUp, Loader2, ArrowRight } from 'lucide-react'
import { useSearchOperations } from '@/hooks/use-search'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [localQuery, setLocalQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const { 
    performQuickSearch, 
    quickResults, 
    clearSearch, 
    isQuickSearchLoading 
  } = useSearchOperations()
  
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save search to recent searches
  const saveToRecentSearches = (query: string) => {
    if (!query.trim()) return

    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Handle search input change with real-time search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalQuery(value)
    
    // Perform real-time search as user types
    if (value.length >= 2) {
      performQuickSearch(value)
    } else {
      // Clear results if query is too short
      performQuickSearch('')
    }
  }

  // Handle search submission
  const handleSearch = (query: string = localQuery) => {
    if (!query.trim()) return

    saveToRecentSearches(query)
    setIsOpen(false)
    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  // Clear search
  const handleClear = () => {
    setLocalQuery('')
    clearSearch()
    inputRef.current?.focus()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const showSuggestions = isOpen && (quickResults.length > 0 || recentSearches.length > 0 || localQuery.length > 0 || isQuickSearchLoading)

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for products, brands, and more..."
          value={localQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isQuickSearchLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-96 overflow-y-auto z-50">
          {/* Loading State */}
          {isQuickSearchLoading && (
            <div className="p-4 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Searching for {localQuery}...</p>
            </div>
          )}

          {/* Real-time Search Results */}
          {!isQuickSearchLoading && quickResults.length > 0 && (
            <div className="p-3">
              <div className="flex items-center px-2 py-1 text-sm font-semibold text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Products ({quickResults.length})
              </div>
              {quickResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0 group"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover mr-3 flex-shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 font-semibold">
                      ${product.original_price}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </Link>
              ))}
            </div>
          )}

          {/* Recent Searches - Show when no real-time results and query is short */}
          {!isQuickSearchLoading && quickResults.length === 0 && recentSearches.length > 0 && localQuery.length < 2 && (
            <div className="p-3">
              <div className="flex items-center px-2 py-1 text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setLocalQuery(search)
                    handleSearch(search)
                  }}
                  className="w-full text-left flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0 group"
                >
                  <Clock className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate group-hover:text-blue-600">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results Found */}
          {!isQuickSearchLoading && quickResults.length === 0 && localQuery.length >= 2 && (
            <div className="p-6 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">No products found for</p>
              <p className="text-sm font-medium text-gray-900 mb-2">{localQuery}</p>
              <p className="text-xs text-gray-500">Try different keywords or check spelling</p>
            </div>
          )}

          {/* Search All Results Button */}
          {localQuery.length >= 2 && quickResults.length > 0 && (
            <div className="border-t border-gray-200 p-3">
              <button
                onClick={() => handleSearch()}
                className="w-full flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <Search className="w-4 h-4 mr-2" />
                View all results for {localQuery}
                <span className="ml-2 text-blue-200">({quickResults.length}+)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}