/* eslint-disable react-hooks/set-state-in-effect */
// components/search/search-bar.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useSearchOperations } from '@/hooks/use-search'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [localQuery, setLocalQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const { performQuickSearch, quickResults, clearSearch } = useSearchOperations()
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

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalQuery(value)
    performQuickSearch(value)
  }

  // Handle search submission
  const handleSearch = (query: string = localQuery) => {
    if (!query.trim()) return

    saveToRecentSearches(query)
    setIsOpen(false)
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

  const showSuggestions = isOpen && (quickResults.length > 0 || recentSearches.length > 0 || localQuery.length > 0)

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for products..."
          value={localQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-96 overflow-y-auto z-50">
          {/* Quick Search Results */}
          {quickResults.length > 0 && (
            <div className="p-2">
              <div className="flex items-center px-2 py-1 text-sm font-semibold text-gray-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Products
              </div>
              {quickResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${product.original_price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && quickResults.length === 0 && (
            <div className="p-2">
              <div className="flex items-center px-2 py-1 text-sm font-semibold text-gray-700">
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
                  className="w-full text-left flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search Button for Current Query */}
          {localQuery && (
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={() => handleSearch()}
                className="w-full flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="w-4 h-4 mr-2" />
                Search for {localQuery}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}