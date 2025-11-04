/* eslint-disable @typescript-eslint/no-explicit-any */
// components/search/search-filters.tsx
'use client'

import { useState, useEffect } from 'react'
import { getCategories } from '@/lib/api/search'

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void
  initialFilters?: any
}

interface Category {
  id: number
  name: string
  image: string
  products_count: number
}

export default function SearchFilters({ onFilterChange, initialFilters = {} }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    min_price: initialFilters.min_price || '',
    max_price: initialFilters.max_price || '',
    main_category_id: initialFilters.main_category_id || '',
    sub_category_id: initialFilters.sub_category_id || '',
    date_from: initialFilters.date_from || '',
    date_to: initialFilters.date_to || ''
  })

  const [categories, setCategories] = useState<Category[]>([])

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories()
      setCategories(cats)
    }
    loadCategories()
  }, [])

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Convert empty strings to undefined for API
    const apiFilters = Object.fromEntries(
      Object.entries(newFilters).map(([k, v]) => [k, v === '' ? undefined : v])
    )
    
    onFilterChange(apiFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      min_price: '',
      max_price: '',
      main_category_id: '',
      sub_category_id: '',
      date_from: '',
      date_to: ''
    }
    setFilters(clearedFilters)
    onFilterChange({})
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.min_price}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.max_price}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Main Category */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Main Category</h4>
          <select
            value={filters.main_category_id}
            onChange={(e) => handleFilterChange('main_category_id', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.products_count})
              </option>
            ))}
          </select>
        </div>

        {/* Sub Category - You might need to fetch sub-categories based on main category */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Sub Category</h4>
          <input
            type="number"
            placeholder="Sub Category ID"
            value={filters.sub_category_id}
            onChange={(e) => handleFilterChange('sub_category_id', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter sub-category ID (you might need to implement sub-category dropdown)
          </p>
        </div>

        {/* Date Range */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Date Range</h4>
          <div className="space-y-2">
            <input
              type="date"
              placeholder="From Date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}