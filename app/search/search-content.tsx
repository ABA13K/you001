/* eslint-disable @typescript-eslint/no-explicit-any */
// app/search/search-content.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useSearchOperations } from '@/hooks/use-search'
import ProductCard from '@/components/products/product-card'
import SearchFilters from '@/components/search/search-filters'
import SearchSort from '@/components/search/search-sort'
import { ProductsLoading } from '@/components/products/products-loading'
import { Search, Filter, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchContentProps {
  searchParams: URLSearchParams
}

export default function SearchContent({ searchParams }: SearchContentProps) {
  const router = useRouter()
  
  // Get all search parameters
  const query = searchParams.get('q') || ''
  const minPrice = searchParams.get('min_price')
  const maxPrice = searchParams.get('max_price')
  const mainCategoryId = searchParams.get('main_category_id')
  const subCategoryId = searchParams.get('sub_category_id')
  const dateFrom = searchParams.get('date_from')
  const dateTo = searchParams.get('date_to')
  const sortBy = searchParams.get('sort_by') || 'relevance'
  const page = parseInt(searchParams.get('page') || '1')
  
  const {
    results,
    total,
    loading,
    error,
    hasMore,
    performSearch,
    performFilter
  } = useSearchOperations()

  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Check if we have filter parameters (not just search query)
  const hasFilters = minPrice || maxPrice || mainCategoryId || subCategoryId || dateFrom || dateTo

  // Perform search or filter based on parameters
  useEffect(() => {
    if (query || hasFilters) {
      // Prepare filters object
      const filters: any = {
        q: query || undefined,
        min_price: minPrice ? parseInt(minPrice) : undefined,
        max_price: maxPrice ? parseInt(maxPrice) : undefined,
        main_category_id: mainCategoryId ? parseInt(mainCategoryId) : undefined,
        sub_category_id: subCategoryId ? parseInt(subCategoryId) : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        sort_by: sortBy
      }

      // Clean up undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key]
        }
      })

      if (hasFilters && !query) {
        // Use filter endpoint when we have filters but no search query
        performFilter(filters, page)
      } else {
        // Use search endpoint when we have a query
        performSearch({
          query,
          page,
          limit: 12,
          filters
        })
      }
    }
  }, [
    query, minPrice, maxPrice, mainCategoryId, subCategoryId, 
    dateFrom, dateTo, sortBy, page, hasFilters, performSearch, performFilter
  ])

  const handleLoadMore = () => {
    const nextPage = page + 1
    updateURLParams({ page: nextPage.toString() })
  }

  const handleFilterChange = (newFilters: any) => {
    // Reset to page 1 when filters change
    updateURLParams({ ...newFilters, page: '1' })
  }

  const handleSortChange = (sortBy: string) => {
    updateURLParams({ sort_by: sortBy, page: '1' })
  }

  const updateURLParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams()
    
    // Keep existing parameters
    if (query) newParams.set('q', query)
    if (minPrice) newParams.set('min_price', minPrice)
    if (maxPrice) newParams.set('max_price', maxPrice)
    if (mainCategoryId) newParams.set('main_category_id', mainCategoryId)
    if (subCategoryId) newParams.set('sub_category_id', subCategoryId)
    if (dateFrom) newParams.set('date_from', dateFrom)
    if (dateTo) newParams.set('date_to', dateTo)
    if (sortBy) newParams.set('sort_by', sortBy)
    
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '') {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })

    router.push(`/search?${newParams.toString()}`)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {query ? `Search Results for "${query}"` : 'Filtered Products'}
              </h1>
              {total > 0 && (
                <p className="text-gray-600 mt-1">
                  {total} {total === 1 ? 'product' : 'products'} found
                </p>
              )}
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <SearchFilters 
              onFilterChange={handleFilterChange}
              initialFilters={{
                min_price: minPrice || '',
                max_price: maxPrice || '',
                main_category_id: mainCategoryId || '',
                sub_category_id: subCategoryId || '',
                date_from: dateFrom || '',
                date_to: dateTo || ''
              }}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <SearchSort onSortChange={handleSortChange} initialSort={sortBy} />
              
              {total > 0 && (
                <p className="text-sm text-gray-600">
                  Showing {results.length} of {total} products
                </p>
              )}
            </div>

            {/* Results */}
            {loading && page === 1 ? (
              <ProductsLoading count={12} />
            ) : results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            ) : query || hasFilters ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h2>
                <p className="text-gray-600">
                  {query 
                    ? `We couldn't find any products matching "${query}". Try different keywords.`
                    : 'No products match your filter criteria. Try adjusting your filters.'
                  }
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Start searching or filtering
                </h2>
                <p className="text-gray-600">
                  Enter a search term or use filters to find products.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <SearchFilters 
                onFilterChange={handleFilterChange}
                initialFilters={{
                  min_price: minPrice || '',
                  max_price: maxPrice || '',
                  main_category_id: mainCategoryId || '',
                  sub_category_id: subCategoryId || '',
                  date_from: dateFrom || '',
                  date_to: dateTo || ''
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}