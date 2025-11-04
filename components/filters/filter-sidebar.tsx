// components/filters/filter-sidebar.tsx
'use client'

import { useState } from 'react'
import PriceFilter from './price-filter'
import CategoryFilter from './category-filter'
import SortOptions from './sort-options'
import { Filter, X } from 'lucide-react'

interface ProductsFilterProps {
  onFiltersChange: (filters: {
    priceRange: { min: number; max: number }
    categories: string[]
    sortBy: string
  }) => void
}

export default function ProductsFilter({ onFiltersChange }: ProductsFilterProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 10000 },
    categories: [] as string[],
    sortBy: 'featured'
  })

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handlePriceChange = (min: number, max: number) => {
    updateFilters({ priceRange: { min, max } })
  }

  const handleCategoryChange = (categories: string[]) => {
    updateFilters({ categories })
  }

  const handleSortChange = (sortBy: string) => {
    updateFilters({ sortBy })
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      priceRange: { min: 0, max: 10000 },
      categories: [],
      sortBy: 'featured'
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.priceRange.min > 0 || 
    filters.priceRange.max < 10000

  return (
    <div className="bg-white">
      {/* Mobile Filter Button */}
      <div className="lg:hidden border-b border-gray-200 p-4">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center space-x-2 text-sm font-medium text-gray-700"
        >
          <Filter size={16} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filters Overlay */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              <PriceFilter onPriceChange={handlePriceChange} />
              <CategoryFilter onCategoryChange={handleCategoryChange} categories={[]} />
              
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block p-6 border-r border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-8">
          <PriceFilter onPriceChange={handlePriceChange} />
          <CategoryFilter onCategoryChange={handleCategoryChange} categories={[]} />
        </div>
      </div>

      {/* Sort Options - Always visible */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing products
          </div>
          <SortOptions onSortChange={handleSortChange} />
        </div>
      </div>
    </div>
  )
}