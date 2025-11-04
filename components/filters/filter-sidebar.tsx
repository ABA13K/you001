// src/components/filters/filter-sidebar.tsx
'use client'

import { useState } from 'react'
import PriceFilter from './price-filter'
import CategoryFilter from './category-filter'
import SortOptions from './sort-options'

interface FilterSidebarProps {
  categories: string[]
  onFilterChange: (filters: any) => void
}

export default function FilterSidebar({ categories, onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    categories: [] as string[],
    sortBy: 'date'
  })

  const updateFilters = (newFilters: any) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-4">Filters</h3>
      
      <SortOptions 
        value={filters.sortBy}
        onChange={(sortBy) => updateFilters({ sortBy })}
      />
      
      <PriceFilter 
        value={filters.priceRange}
        onChange={(priceRange) => updateFilters({ priceRange })}
      />
      
      <CategoryFilter 
        categories={categories}
        selected={filters.categories}
        onChange={(categories) => updateFilters({ categories })}
      />
    </div>
  )
}